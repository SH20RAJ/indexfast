import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import db from "@/lib/db";
import { sites, users, submissions, usageLogs } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { getIndexNowHost, getIndexNowKeyLocation, chunkArray, submitToIndexNow } from "@/lib/url-utils";

export async function GET(request: Request) {
  // 1. Verify Vercel Cron or Secret Query Param
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');
  
  const authHeader = request.headers.get('authorization');
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isValidSecret = secretParam === process.env.CRON_SECRET;
  
  if (!isVercelCron && !isValidSecret && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch sites with autoIndex enabled OR the specific site if secret matches its triggerSecret
    let targetSites: (typeof sites.$inferSelect)[] = [];
    if (secretParam && secretParam !== process.env.CRON_SECRET) {
        // Assume it might be a per-site trigger secret
        const siteBySecret = await db.query.sites.findFirst({
            where: eq(sites.triggerSecret, secretParam)
        });
        if (siteBySecret) targetSites = [siteBySecret];
    } else {
        targetSites = await db.query.sites.findMany({
            where: eq(sites.autoIndex, true)
        });
    }

    if (targetSites.length === 0) {
        return NextResponse.json({ message: 'No targets found', processed: 0 });
    }

    const results = [];
    let totalUrlsSubmitted = 0;

    // 3. Process each site
    for (const site of targetSites) {
        if (!site.indexNowKey) {
            results.push({ site: site.domain, status: 'skipped', reason: 'No IndexNow key' });
            continue;
        }

        // Fetch User and limits
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, site.userId)
        });

        if (!dbUser) {
            results.push({ site: site.domain, status: 'skipped', reason: 'User not found' });
            continue;
        }

        // Strictly require Pro or Business for auto-indexing
        if (dbUser.plan !== 'pro' && dbUser.plan !== 'business') {
            results.push({ site: site.domain, status: 'skipped', reason: 'Requires Pro/Business plan' });
            continue;
        }

        // Enforce actual user credits
        const availableCredits = dbUser.credits; 

        // Extract Sitemap
        const protocol = site.domain.startsWith('http') ? '' : 'https://';
        const targetSitemapUrl = `${protocol}${site.domain}/sitemap.xml`;
        const allUrls: string[] = [];

        try {
            const xmlRes = await fetch(targetSitemapUrl);
            if (xmlRes.ok) {
                const xmlText = await xmlRes.text();
                const parser = new XMLParser();
                const xmlObj = parser.parse(xmlText);
                
                if (xmlObj.urlset && xmlObj.urlset.url) {
                    const urlList = Array.isArray(xmlObj.urlset.url) ? xmlObj.urlset.url : [xmlObj.urlset.url];
                    const locs = urlList.map((u: { loc?: string }) => u.loc).filter(Boolean) as string[];
                    allUrls.push(...locs);
                } else if (xmlObj.sitemapindex && xmlObj.sitemapindex.sitemap) {
                    const sitemapList = Array.isArray(xmlObj.sitemapindex.sitemap) 
                        ? xmlObj.sitemapindex.sitemap 
                        : [xmlObj.sitemapindex.sitemap];
                    
                    for (const sm of sitemapList) {
                        if (!sm.loc) continue;
                        try {
                            const childRes = await fetch(sm.loc);
                            if (childRes.ok) {
                                const childXml = await childRes.text();
                                const childObj = new XMLParser().parse(childXml);
                                if (childObj.urlset && childObj.urlset.url) {
                                    const urls = Array.isArray(childObj.urlset.url) ? childObj.urlset.url : [childObj.urlset.url];
                                    const locs = urls.map((u: { loc?: string }) => u.loc).filter(Boolean) as string[];
                                    allUrls.push(...locs);
                                }
                            }
                        } catch {
                            // ignore child fetch errors
                        }
                    }
                }
            }
        } catch (e) {
            console.error(`Failed to fetch sitemap for ${site.domain}`, e);
        }

        if (allUrls.length === 0) {
            allUrls.push(site.domain);
        }

        // Limit URLs to available credits
        const urlsToSubmit = allUrls.slice(0, availableCredits);

        if (urlsToSubmit.length === 0) {
            results.push({ site: site.domain, status: 'skipped', reason: 'No URLs or credits' });
            continue;
        }

        const host = getIndexNowHost(site.domain);
        const keyLocation = getIndexNowKeyLocation(site);
        
        // Chunked Submission (IndexNow limit is 10k, but we use smaller chunks for reliability)
        const urlChunks = chunkArray(urlsToSubmit, 500);
        let siteSuccessCount = 0;
        let lastError = null;

        for (const chunk of urlChunks) {
            const result = await submitToIndexNow(host, site.indexNowKey, keyLocation, chunk);
            if (result.success) {
                siteSuccessCount += chunk.length;
            } else {
                lastError = result.message || "Unknown error";
            }
        }

        if (siteSuccessCount > 0) {
            // Deduct credits and update lastSyncAt
            await db.update(users)
                .set({
                    credits: sql`${users.credits} - ${siteSuccessCount}`,
                    updatedAt: new Date()
                })
                .where(eq(users.id, dbUser.id));

            await db.update(sites)
                .set({ lastSyncAt: new Date() })
                .where(eq(sites.id, site.id));

            // Log submission
            await db.insert(usageLogs)
                .values({
                    userId: dbUser.id,
                    date: new Date().toISOString().split('T')[0],
                    count: siteSuccessCount,
                    type: 'submission'
                })
                .onConflictDoUpdate({
                    target: [usageLogs.userId, usageLogs.date, usageLogs.type],
                    set: {
                        count: sql`${usageLogs.count} + ${siteSuccessCount}`,
                        updatedAt: new Date()
                    }
                });

            // Log individual URLs
            const submissionsValues = urlsToSubmit.slice(0, siteSuccessCount).map(url => ({
                siteId: site.id,
                url: url,
                status: 200,
                submittedAt: new Date()
            }));
            
            await db.insert(submissions).values(submissionsValues);
            totalUrlsSubmitted += siteSuccessCount;
            
            results.push({ site: site.domain, status: siteSuccessCount === urlsToSubmit.length ? 'success' : 'partial', submitted: siteSuccessCount });
        } else {
            results.push({ site: site.domain, status: 'failed', reason: lastError });
        }
    }

    return NextResponse.json({ 
        success: true, 
        message: `Processed ${targetSites.length} sites.`,
        totalUrlsSubmitted,
        results
    });

  } catch (error: unknown) {
    console.error("Cron Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: 'Failed to run cron job', message: msg }, { status: 500 });
  }
}

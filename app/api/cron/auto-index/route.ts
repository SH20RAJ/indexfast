import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import db from "@/lib/db";
import { sites, users, submissions, usageLogs } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Helper to submit to IndexNow
async function submitToIndexNow(host: string, key: string, keyLocation: string | null, urlList: string[]) {
  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList
      })
    });
    return { success: response.ok, status: response.status, message: response.statusText };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, status: 500, message: msg };
  }
}

export async function GET(request: Request) {
  // 1. Verify Vercel Cron
  // Only allow requests that have the Vercel cron header or a valid dev setup
  const authHeader = request.headers.get('authorization');
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  
  // You might also want to allow manual triggers in dev mode
  if (!isVercelCron && process.env.NODE_ENV === 'production') {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch all sites with autoIndex enabled
    const autoIndexSites = await db.query.sites.findMany({
        where: eq(sites.autoIndex, true)
    });

    if (autoIndexSites.length === 0) {
        return NextResponse.json({ message: 'No auto-index sites found', processed: 0 });
    }

    const results = [];
    let totalUrlsSubmitted = 0;

    // 3. Process each site
    for (const site of autoIndexSites) {
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

        // Apply Free Beta Mock limits (Unlimited Pro)
        const availableCredits = 999999; 

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

        const host = site.domain.replace('https://', '').replace('http://', '').split('/')[0];
        
        // Submit
        const submissionResult = await submitToIndexNow(host, site.indexNowKey, null, urlsToSubmit);

        if (submissionResult.success) {
            // Log submission
            await db.insert(usageLogs).values({
                userId: dbUser.id,
                date: new Date().toISOString().split('T')[0],
                count: urlsToSubmit.length,
                type: 'submission'
            });

            // Log individual URLs
            const submissionsValues = urlsToSubmit.map(url => ({
                siteId: site.id,
                url: url,
                status: 200,
                submittedAt: new Date()
            }));
            
            await db.insert(submissions).values(submissionsValues);
            totalUrlsSubmitted += urlsToSubmit.length;
            
            results.push({ site: site.domain, status: 'success', submitted: urlsToSubmit.length });
        } else {
            results.push({ site: site.domain, status: 'failed', reason: submissionResult.message });
        }
    }

    return NextResponse.json({ 
        success: true, 
        message: `Processed ${autoIndexSites.length} sites.`,
        totalUrlsSubmitted,
        results
    });

  } catch (error: unknown) {
    console.error("Cron Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: 'Failed to run cron job', message: msg }, { status: 500 });
  }
}

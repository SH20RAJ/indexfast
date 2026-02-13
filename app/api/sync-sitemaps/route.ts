
import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import db from "@/lib/db"
import { sites, submissions, usageLogs } from "@/lib/schema"
import { eq } from "drizzle-orm"

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

import { enforcePlanLimits } from "@/lib/plan-guard";
import { deductCredit } from "@/app/actions/dashboard";

export async function POST(request: Request) {
  // Parse body ONCE
  const body = await request.json() as {
    siteUrl?: string;
    manualUrls?: string[];
    sitemapUrl?: string;
  };

  const { siteUrl, manualUrls, sitemapUrl: specificSitemapUrl } = body;

  try {
    if (!siteUrl) {
        return NextResponse.json({ error: 'Missing siteUrl' }, { status: 400 });
    }

    // 1. Access Check
    const { allowed, user, error } = await enforcePlanLimits();
    
    if (!allowed || !user) {
        return NextResponse.json({ error: error || 'Access Denied' }, { status: 403 });
    }

    // 2. Fetch Site from DB
    const dbSite = await db.select().from(sites).where(eq(sites.gscSiteUrl, siteUrl)).limit(1);
    if (!dbSite || dbSite.length === 0) {
        return NextResponse.json({ error: 'Site not found in DB' }, { status: 404 })
    }
    const site = dbSite[0];

    // 3. Collect URLs to submit
    const allUrls: string[] = [];

    if (manualUrls && Array.isArray(manualUrls) && manualUrls.length > 0) {
        // Manual URL submission mode
        allUrls.push(...manualUrls);
    } else {
        // Sitemap-based mode: use specific sitemap URL or fallback to default
        let targetSitemapUrl = specificSitemapUrl;
        if (!targetSitemapUrl) {
            const protocol = site.domain.startsWith('http') ? '' : 'https://';
            targetSitemapUrl = `${protocol}${site.domain}/sitemap.xml`;
        }

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
                    // Sitemap index: fetch child sitemaps (1 level deep)
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
                        } catch (childErr) {
                            console.error(`Failed to fetch child sitemap ${sm.loc}`, childErr);
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Failed to fetch sitemap", e);
        }
    }
    
    if (allUrls.length === 0) {
        allUrls.push(site.domain);
    }

    // 4. Credit Enforcement
    const requiredCredits = allUrls.length;
    let urlsToSubmit = allUrls;

    const creditCheck = await enforcePlanLimits({ requiredCredits });
    
    if (!creditCheck.allowed) {
        const availableCredits = creditCheck.user!.credits;
        
        if (availableCredits > 0) {
             console.log(`User has ${availableCredits} credits, but ${requiredCredits} URLs found. Truncating.`);
             urlsToSubmit = urlsToSubmit.slice(0, availableCredits);
        } else {
             return NextResponse.json({ error: creditCheck.error }, { status: 403 });
        }
    }

    // 5. Submit to IndexNow
    const indexNowKey = site.indexNowKey;
    if (!indexNowKey) {
        return NextResponse.json({ 
            error: 'IndexNow key not configured for this site. Go to Site Settings to set up your IndexNow key.',
            success: false
        }, { status: 400 });
    }
    const host = site.domain.replace('https://', '').replace('http://', '').split('/')[0];
    
    const submissionResult = await submitToIndexNow(host, indexNowKey, null, urlsToSubmit);

    // 6. Deduct Credits & Log
    if (submissionResult.success) {
        await deductCredit(urlsToSubmit.length);
        
        await db.insert(usageLogs).values({
            userId: user.id,
            date: new Date().toISOString().split('T')[0],
            count: urlsToSubmit.length,
            type: 'submission'
        });
    }

    // 7. Save Submissions
    if (urlsToSubmit.length > 0) {
        const submissionsValues = urlsToSubmit.map(url => ({
            siteId: site.id,
            url: url,
            status: submissionResult.success ? 200 : 500,
            submittedAt: new Date()
        }));
        
        await db.insert(submissions).values(submissionsValues);
    }
    
    const finalCredits = (creditCheck.user!.credits > urlsToSubmit.length) 
        ? creditCheck.user!.credits - urlsToSubmit.length 
        : 0;

    return NextResponse.json({ 
        success: submissionResult.success, 
        processed: allUrls.length, 
        submitted: urlsToSubmit.length,
        credits_remaining: finalCredits, 
        result: submissionResult
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process sync' }, { status: 500 })
  }
}

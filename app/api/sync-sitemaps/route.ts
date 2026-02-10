
import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { stackServerApp } from "@/stack/server"
import db from "@/lib/db"
import { sites, submissions, usageLogs, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { checkCredits, deductCredit } from "@/app/actions/dashboard"

// Helper to submit to IndexNow (simplified for Drizzle context)
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
  } catch (e: any) {
    return { success: false, status: 500, message: e.message };
  }
}

export async function POST(request: Request) {
  const { siteUrl } = await request.json() as { siteUrl: string }
  const user = await stackServerApp.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Check Credits
    const hasCredits = await checkCredits();
    if (!hasCredits) {
        return NextResponse.json({ error: 'Insufficient credits. Please upgrade your plan.' }, { status: 403 })
    }

    // 2. Fetch Site from DB
    const dbSite = await db.select().from(sites).where(eq(sites.gscSiteUrl, siteUrl)).limit(1);
    if (!dbSite || dbSite.length === 0) {
        return NextResponse.json({ error: 'Site not found in DB' }, { status: 404 })
    }
    const site = dbSite[0];

    // 3. Fetch Sitemaps from GSC (using StackAuth token if available, or just parse provided URL if public)
    // NOTE: For this implementation, we are assuming public sitemap crawling for simplicity
    // or we'd need the GSC token again. 
    // Since we are "syncing", let's assume we crawl the sitemap.xml of the site.
    
    // Construct sitemap URL (naive)
    const sitemapUrl = `${site.domain}/sitemap.xml`;
    
    const allUrls: string[] = [];
    try {
        const xmlRes = await fetch(sitemapUrl);
        if (xmlRes.ok) {
            const xmlText = await xmlRes.text();
            const parser = new XMLParser();
            const xmlObj = parser.parse(xmlText);
            
            if (xmlObj.urlset && xmlObj.urlset.url) {
                const urlList = Array.isArray(xmlObj.urlset.url) ? xmlObj.urlset.url : [xmlObj.urlset.url];
                const locs = urlList.map((u: any) => u.loc).filter(Boolean);
                allUrls.push(...locs);
            } else if (xmlObj.sitemapindex && xmlObj.sitemapindex.sitemap) {
                 // Handle sitemap index... (skip for MVP/Task scope to keep it simple)
                 // Just warning
                 console.warn("Sitemap index found, but deep crawling not fully implemented in this step.");
            }
        }
    } catch (e) {
        console.error("Failed to fetch sitemap", e);
    }
    
    // Fallback: if no URLs found from sitemap, maybe just submit the home page
    if (allUrls.length === 0) {
        allUrls.push(site.domain);
    }

    // 4. Submit to IndexNow
    const indexNowKey = "435967000af447608269550307049386"; 
    const host = site.domain.replace('https://', '').replace('http://', '').split('/')[0];
    
    // Determine max URLs based on plan (basic enforcement)
    // Free: max 10/day total (checked via credits), batch size could be small
    // Pro/Business: Higher limits
    // But we rely on credits mainly.
    
    let urlsToSubmit = allUrls;
    
    // Check credits for TOTAL URLs
    const requiredCredits = urlsToSubmit.length;
    
    // If we want to support partial submission if credits are low, we could slice.
    // But for now, let's just fail if not enough credits for the whole batch or slice to available credits.
    
    const userCredits = (await db.query.users.findFirst({ where: eq(users.id, user.id) }))?.credits || 0;
    
    if (userCredits < requiredCredits) {
        // Option A: Reject
        // return NextResponse.json({ error: `Insufficient credits. You need ${requiredCredits} but have ${userCredits}.` }, { status: 403 });
        
        // Option B: Submit what we can
        console.log(`User has ${userCredits} credits, but ${requiredCredits} URLs found. Truncating.`);
        urlsToSubmit = urlsToSubmit.slice(0, userCredits);
    }
    
    // Double check we have > 0
    if (urlsToSubmit.length === 0) {
         return NextResponse.json({ error: 'No URLs to submit or 0 credits remaining.' }, { status: 403 });
    }

    const submissionResult = await submitToIndexNow(host, indexNowKey, null, urlsToSubmit);

    // 5. Deduct Credits & Log Usage
    if (submissionResult.success) {
        // Deduct 1 credit per URL submitted
        await deductCredit(urlsToSubmit.length);
        
        // Log usage
        await db.insert(usageLogs).values({
            userId: user.id,
            date: new Date().toISOString().split('T')[0],
            count: urlsToSubmit.length,
            type: 'submission'
        });
    }

    // 6. Save Submissions to DB
    if (urlsToSubmit.length > 0) {
        const submissionsValues = urlsToSubmit.map(url => ({
            siteId: site.id,
            url: url,
            status: submissionResult.success ? 200 : 500,
            submittedAt: new Date()
        }));
        
        await db.insert(submissions).values(submissionsValues);
    }

    return NextResponse.json({ 
        success: submissionResult.success, 
        processed: allUrls.length, 
        submitted: urlsToSubmit.length,
        credits_remaining: (userCredits - urlsToSubmit.length), 
        result: submissionResult
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process sync' }, { status: 500 })
  }
}

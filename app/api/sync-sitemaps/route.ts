
import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { stackServerApp } from "@/stack/server"
import db from "@/lib/db"
import { sites, submissions, usageLogs, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { checkCredits } from "@/app/actions/dashboard"

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

import { enforcePlanLimits } from "@/lib/plan-guard";
import { deductCredit } from "@/app/actions/dashboard";

export async function POST(request: Request) {
  const { siteUrl } = await request.json() as { siteUrl: string }

  try {
    if (!siteUrl) {
        return NextResponse.json({ error: 'Missing siteUrl' }, { status: 400 });
    }

    // 1. Initial Access Check
    // We don't know credits yet as we haven't fetched sitemap, but let's at least check user existence
    const { allowed, user, error } = await enforcePlanLimits();
    
    if (!allowed || !user) {
        return NextResponse.json({ error: error || 'Access Denied' }, { status: 403 });
    }

    // 2. Fetch Site from DB
    const dbSite = await db.select().from(sites).where(eq(sites.gscSiteUrl, siteUrl)).limit(1);
    // ... same site fetch ...
    if (!dbSite || dbSite.length === 0) {
        return NextResponse.json({ error: 'Site not found in DB' }, { status: 404 })
    }
    const site = dbSite[0];

    // ... sitemap fetching ...
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
            }
        }
    } catch (e) {
        console.error("Failed to fetch sitemap", e);
    }
    
    if (allUrls.length === 0) {
        // ... fallback ...
        allUrls.push(site.domain);
    }

    // 3. Strict Credit Enforcement with Guard
    // Re-check with specific amount required
    const requiredCredits = allUrls.length;
    let urlsToSubmit = allUrls;

    // Check if user has enough credits for ALL found URLs
    const creditCheck = await enforcePlanLimits({ requiredCredits });
    
    if (!creditCheck.allowed) {
        // If not enough for ALL, try partial if user has SOME credits
        // User object is fresh from guard check
        const availableCredits = creditCheck.user!.credits;
        
        if (availableCredits > 0) {
             console.log(`User has ${availableCredits} credits, but ${requiredCredits} URLs found. Truncating.`);
             urlsToSubmit = urlsToSubmit.slice(0, availableCredits);
        } else {
             return NextResponse.json({ error: creditCheck.error }, { status: 403 });
        }
    }

    // 4. Submit to IndexNow
    const indexNowKey = "435967000af447608269550307049386"; 
    const host = site.domain.replace('https://', '').replace('http://', '').split('/')[0];
    
    const submissionResult = await submitToIndexNow(host, indexNowKey, null, urlsToSubmit);

    // 5. Deduct Credits
    if (submissionResult.success) {
        await deductCredit(urlsToSubmit.length);
        
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
    
    // Calculate remaining for response
    // Fetch fresh just in case or calculate
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

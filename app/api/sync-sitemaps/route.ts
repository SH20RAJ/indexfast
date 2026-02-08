
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { submitToIndexNow } from '@/utils/indexnow'

export async function POST(request: Request) {
  const { siteUrl } = await request.json()
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.provider_token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Fetch Site Config from DB to get IndexNow Key (if we were generating one)
    // For GSC integration, we technically need to Host a key. 
    // IF the user hasn't set up a key, IndexNow won't work.
    // BUT since we are "Importing from GSC", we assume they might want us to handle it.
    // For MVP, let's assume we just want to push URLs and see what happens, 
    // OR we generate a key and tell them to upload it.
    // Let's check if we have a key in DB.
    
    // Fetch site details
    const { data: site } = await supabase
      .from('sites')
      .select('*')
      .eq('gsc_site_url', siteUrl)
      .single()

    if (!site) {
        return NextResponse.json({ error: 'Site not found in DB' }, { status: 404 })
    }

    // 2. Fetch Sitemaps from GSC
    const sitemapsResponse = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
      {
        headers: { Authorization: `Bearer ${session.provider_token}` }
      }
    )
    const sitemapsData = await sitemapsResponse.json()

    if (!sitemapsData.sitemap) {
        return NextResponse.json({ message: 'No sitemaps found' })
    }

    const parser = new XMLParser()
    let allUrls: string[] = []

    // 3. Parse Sitemaps
    for (const sitemap of sitemapsData.sitemap || []) {
       try {
         const xmlRes = await fetch(sitemap.path)
         if (!xmlRes.ok) continue
         const xmlText = await xmlRes.text()
         const xmlObj = parser.parse(xmlText)

         if (xmlObj.urlset && xmlObj.urlset.url) {
            const urlList = Array.isArray(xmlObj.urlset.url) 
              ? xmlObj.urlset.url 
              : [xmlObj.urlset.url]
            
            const locs = urlList.map((u: any) => u.loc).filter(Boolean)
            allUrls.push(...locs)
         }
       } catch (err) {
         console.error('Error parsing sitemap', sitemap.path, err)
       }
    }
    
    // 4. Filter for NEW URLs (simple diff against DB)
    // In a real app, we'd only select URLs that aren't in `submissions` or check `lastmod`
    // For MVP, we'll try to insert and on conflict do nothing? 
    // Or just submit everything (IndexNow allows updating).
    
    // Let's submit batches of 10,000 (IndexNow limit)
    // For MVP, limit to 50 for testing
    const urlsToSubmit = allUrls.slice(0, 50) 
    
    // 5. Submit to IndexNow
    // We need a key. If we don't have one, we generate a dummy or fail.
    // Realistically, the user MUST put a key file text on their server.
    // For now, let's assume they have one or we skip.
    // If we don't know the key, we can't submit. 
    // Let's assume the user provided it in a settings page (TODO).
    // For this step, I'll allow "dry run" if no key.
    
    let submissionResult = { success: false, message: 'No IndexNow key configured' }
    
    if (site.indexnow_key) {
        // Parse host from siteUrl (sc-domain:example.com -> example.com)
        const host = site.domain.replace('sc-domain:', '').replace('https://', '').replace('http://', '').split('/')[0]
        submissionResult = await submitToIndexNow(host, site.indexnow_key, null, urlsToSubmit)
    }

    // 6. Save to DB
    if (urlsToSubmit.length > 0) {
        const submissionsData = urlsToSubmit.map(url => ({
            site_id: site.id,
            url: url,
            status: submissionResult.success ? 200 : 0
        }))

        await supabase.from('submissions').upsert(submissionsData, { onConflict: 'site_id,url' })
    }

    return NextResponse.json({ 
        success: true, 
        processed: allUrls.length, 
        submitted: urlsToSubmit.length,
        indexNowResult: submissionResult 
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process sitemaps' }, { status: 500 })
  }
}

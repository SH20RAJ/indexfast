
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'

export async function POST(request: Request) {
  const { siteUrl } = await request.json()
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.provider_token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Fetch Sitemaps list from GSC
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
    let totalUrls = 0


    let totalUrls = 0
    let allUrls: string[] = []

    // 2. For each sitemap, fetch the XML and parse
    for (const sitemap of sitemapsData.sitemap || []) { // Ensure array
       try {
         const xmlRes = await fetch(sitemap.path)
         if (!xmlRes.ok) continue
         const xmlText = await xmlRes.text()
         const xmlObj = parser.parse(xmlText)

         // Handle sitemap index vs urlset
         if (xmlObj.urlset && xmlObj.urlset.url) {
            const urlList = Array.isArray(xmlObj.urlset.url) 
              ? xmlObj.urlset.url 
              : [xmlObj.urlset.url]
            
            const locs = urlList.map((u: any) => u.loc).filter(Boolean)
            allUrls.push(...locs)
         } else if (xmlObj.sitemapindex && xmlObj.sitemapindex.sitemap) {
            // Nested sitemaps - recursive fetch needed? 
            // For MVP, maybe skip deep nesting or handle 1 level
            // Just logging for now
            console.log('Found nested sitemap index', sitemap.path)
         }
       } catch (err) {
         console.error('Error parsing sitemap', sitemap.path, err)
       }
    }
    
    totalUrls = allUrls.length
    // TODO: Insert into DB


    return NextResponse.json({ success: true, processed: totalUrls })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process sitemaps' }, { status: 500 })
  }
}

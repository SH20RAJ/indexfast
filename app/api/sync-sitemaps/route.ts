
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

    // 2. For each sitemap, fetch the XML and parse
    for (const sitemap of sitemapsData.sitemap) {
       // Only process indexable sitemaps
       const xmlRes = await fetch(sitemap.path)
       const xmlText = await xmlRes.text()
       const xmlObj = parser.parse(xmlText)

       // Handle sitemap index vs urlset
       let urls: string[] = []
       if (xmlObj.urlset && xmlObj.urlset.url) {
          const urlList = Array.isArray(xmlObj.urlset.url) ? xmlObj.urlset.url : [xmlObj.urlset.url]
          urls = urlList.map((u: any) => u.loc)
       }
       
       // TODO: Save to DB (batch insert)
       // For MVP, just counting
       totalUrls += urls.length
    }

    return NextResponse.json({ success: true, processed: totalUrls })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process sitemaps' }, { status: 500 })
  }
}

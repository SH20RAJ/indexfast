import { Metadata } from 'next'

const baseMetadata: Metadata = {
  metadataBase: new URL('https://indexfast.com'),
  applicationName: 'IndexFast',
  authors: [{ name: 'IndexFast Team', url: 'https://indexfast.com' }],
  generator: 'Next.js',
  keywords: [
    'google indexing', 'seo tools', 'indexnow', 'fast indexing', 
    'google search console api', 'bing indexing', 'yandex indexing', 
    'automated seo', 'sitemap sync'
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'IndexFast',
  publisher: 'IndexFast',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://indexfast.com',
    siteName: 'IndexFast',
    title: 'IndexFast - Automate Google Indexing',
    description: 'Submit your URLs to Google, Bing, and Yandex automatically. The fastest way to get indexed.',
    images: [
      {
        url: 'https://indexfast.com/og-image.jpg', // We should ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: 'IndexFast Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IndexFast - Automate Google Indexing',
    description: 'Stop waiting for Google to crawl your site. Push URLs directly to the index.',
    // images: ['https://indexfast.com/og-image.jpg'], // Optional if same as OG
    creator: '@indexfast',
  },
  alternates: {
    canonical: 'https://indexfast.com',
  }
}

export default baseMetadata

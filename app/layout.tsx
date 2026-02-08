import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL('https://indexfast.com'),
  title: {
    default: 'IndexFast - Automate Google Indexing',
    template: '%s | IndexFast',
  },
  description: 'Automatically submit your new content to Google, Bing, and Yandex. The fastest way to get indexed.',
  openGraph: {
    title: 'IndexFast - Automate Google Indexing',
    description: 'Stop waiting for Google to crawl your site. Push URLs directly to the index.',
    url: 'https://indexfast.com',
    siteName: 'IndexFast',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IndexFast - Automate Google Indexing',
    description: 'Stop waiting for Google to crawl your site. Push URLs directly to the index.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

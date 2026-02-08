import type { Metadata } from 'next'
import { Inter, Patrick_Hand } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from "@/components/ui/sonner"
import baseMetadata from '@/lib/metadata'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const patrickHand = Patrick_Hand({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-handwritten' 
})

export const metadata: Metadata = baseMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          patrickHand.variable
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

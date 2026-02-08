import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { Footer } from '@/components/landing/footer'
import { Metadata } from 'next'
import baseMetadata from '@/lib/metadata'

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'IndexFast - Get Indexed in Minutes',
  description: 'The ultimate tool for SEO professionals and content creators to instantly index new pages on Google and Bing.',
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-handwritten">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

import { Pricing } from '@/components/landing/pricing'
import { Metadata } from 'next'
import baseMetadata from '@/lib/metadata'
import { BackgroundBeams } from '@/components/ui/background-beams'

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Pricing - IndexFast',
  description: 'Simple, transparent pricing for instant indexing.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen relative bg-neutral-950">
       <BackgroundBeams className="opacity-20 pointer-events-none fixed inset-0" />
       
       <div className="relative z-10 pt-20">
          <Pricing />
       </div>
    </div>
  )
}

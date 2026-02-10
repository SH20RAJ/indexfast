import { Pricing } from '@/components/landing/pricing'
import { Metadata } from 'next'
import baseMetadata from '@/lib/metadata'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { stackServerApp } from '@/stack/server'
import { getDashboardData } from '@/app/actions/dashboard'

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Pricing - IndexFast',
  description: 'Simple, transparent pricing for instant indexing.',
}

export default async function PricingPage() {
  // Get user authentication status and current plan
  const user = await stackServerApp.getUser();
  let currentPlan: 'free' | 'pro' | 'business' = 'free';
  
  if (user) {
    const dashboardData = await getDashboardData();
    currentPlan = (dashboardData?.user?.plan as 'free' | 'pro' | 'business') || 'free';
  }

  return (
    <div className="min-h-screen relative bg-neutral-950">
       <BackgroundBeams className="opacity-20 pointer-events-none fixed inset-0" />
       
       <div className="relative z-10 pt-20">
          <Pricing currentPlan={currentPlan} isAuthenticated={!!user} />
       </div>
    </div>
  )
}

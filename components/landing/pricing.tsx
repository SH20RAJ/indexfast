"use client";

import { CreativePricing, type PricingTier } from '@/components/ui/creative-pricing'

import { Rocket, Sparkles, Zap } from 'lucide-react'
import { CreativeButton } from '@/components/ui/creative-button'
import Link from 'next/link'

interface PricingProps {
  currentPlan?: 'free' | 'pro' | 'business';
  isAuthenticated?: boolean;
}

export function Pricing({ isAuthenticated = false }: PricingProps) {
  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      icon: <Rocket className="w-6 h-6" />,
      price: 0,
      description: "Perfect for hobbyists and improved indexing.",
      features: [
        "1 Verified Site",
        "10 Submissions / day",
        "Manual Sync",
        "Basic History"
      ],
      color: "blue",
      customButton: (
        <Link href="/dashboard">
          <CreativeButton variant="outline" className="w-full">
            Go to Dashboard
          </CreativeButton>
        </Link>
      )
    },
    {
      name: "Pro",
      icon: <Sparkles className="w-6 h-6" />,
      price: 19,
      description: "For serious content creators and agencies.",
      features: [
        "Unlimited Sites",
        "100 Submissions / day",
        "Auto-Sync (Daily)",
        "Priority Support",
        "Advanced Analytics"
      ],
      popular: true,
      color: "amber",
      customButton: !isAuthenticated ? (
        <Link href="/login">
          <CreativeButton variant="primary" className="w-full">
            Get Started
          </CreativeButton>
        </Link>
      ) : (
        <Link href="/dashboard">
          <CreativeButton variant="primary" className="w-full">
            Included in Free Beta
          </CreativeButton>
        </Link>
      )
    },
    {
      name: "Business",
      icon: <Zap className="w-6 h-6" />,
      price: 49,
      description: "For large organizations and dedicated support.",
      features: [
        "Everything in Pro",
        "1000 Submissions / day",
        "Custom API Limits",
        "Dedicated Account Manager",
        "SLA Support"
      ],
      color: "purple",
      customButton: (
        <CreativeButton variant="outline" disabled className="w-full opacity-50 cursor-not-allowed">
          Coming Soon (Post-Beta)
        </CreativeButton>
      )
    }
  ];

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-zinc-950 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-10 left-10 hidden lg:block opacity-20 rotate-12 pointer-events-none text-zinc-900 dark:text-zinc-100">
        <span className="font-handwritten text-9xl">?</span>
      </div>
      <div className="absolute bottom-10 right-10 hidden lg:block opacity-20 -rotate-12 pointer-events-none text-zinc-900 dark:text-zinc-100">
        <span className="font-handwritten text-9xl">$</span>
      </div>
      <CreativePricing 
        title="Simple, Transparent Pricing"
        description="We are currently in Beta. Enjoy unlimited access to Pro features for free!"
        tiers={pricingTiers}
      />
    </section>
  )
}

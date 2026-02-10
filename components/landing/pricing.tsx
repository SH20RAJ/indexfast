"use client";

import { CreativePricing, type PricingTier } from '@/components/ui/creative-pricing'
import { CheckoutButton } from '@/components/checkout-button'
import { Rocket, Sparkles, Zap } from 'lucide-react'
import { CreativeButton } from '@/components/ui/creative-button'
import Link from 'next/link'

interface PricingProps {
  currentPlan?: 'free' | 'pro' | 'business';
  isAuthenticated?: boolean;
}

const planHierarchy = {
  free: 0,
  pro: 1,
  business: 2,
};

export function Pricing({ currentPlan = 'free', isAuthenticated = false }: PricingProps) {
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
      customButton: currentPlan === 'free' ? (
        <CreativeButton variant="outline" disabled className="w-full">
          Current Plan
        </CreativeButton>
      ) : (
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
      ) : planHierarchy[currentPlan] >= planHierarchy.pro ? (
        <CreativeButton variant="outline" disabled className="w-full">
          {currentPlan === 'pro' ? 'Current Plan' : 'Downgrade to Pro'}
        </CreativeButton>
      ) : (
        <CheckoutButton plan="pro" billingPeriod="monthly" className="w-full">
          Upgrade to Pro
        </CheckoutButton>
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
      customButton: !isAuthenticated ? (
        <Link href="/login">
          <CreativeButton variant="primary" className="w-full">
            Get Started
          </CreativeButton>
        </Link>
      ) : currentPlan === 'business' ? (
        <CreativeButton variant="outline" disabled className="w-full">
          Current Plan
        </CreativeButton>
      ) : (
        <CheckoutButton plan="business" billingPeriod="monthly" className="w-full">
          Upgrade to Business
        </CheckoutButton>
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
        description="Choose the plan that fits your indexing needs."
        tiers={pricingTiers}
      />
    </section>
  )
}

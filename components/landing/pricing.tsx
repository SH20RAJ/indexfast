import { CreativePricing, PricingTier } from '@/components/ui/creative-pricing'
import { Rocket, Sparkles } from 'lucide-react'

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
    },
    {
        name: "Pro",
        icon: <Sparkles className="w-6 h-6" />,
        price: 19,
        description: "For serious content creators and agencies.",
        features: [
            "Unlimited Sites",
            "Unlimited Submissions",
            "Auto-Sync (Daily)",
            "Priority Support",
            "Advanced Analytics"
        ],
        popular: true,
        color: "amber",
    }
]

export function Pricing() {
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

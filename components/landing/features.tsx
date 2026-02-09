"use client";

import { CreativeCard } from '@/components/ui/creative-card'
import { CheckCircle2, Zap, BarChart3 } from 'lucide-react'

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-features transition-colors duration-300">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
            <h2 className="font-handwritten text-4xl md:text-5xl font-bold mb-4 text-foreground">Why IndexFast?</h2>
            <p className="font-handwritten text-xl text-muted-foreground">Three simple reasons to switch.</p>
        </div>
        <div className="grid gap-8 md:gap-12 md:grid-cols-3">
            <CreativeCard rotate="left" className="h-full">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-effect-2/20 px-3 py-1 text-sm font-handwritten font-bold text-brand border-2 border-effect-2/30">
                        Integration
                    </div>
                    <h3 className="font-handwritten text-2xl font-bold flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        Google Search Console
                    </h3>
                    <p className="font-handwritten text-lg text-muted-foreground">
                    One-click import of all your verified sites. We verify ownership automatically.
                    </p>
                </div>
            </CreativeCard>

            <CreativeCard rotate="right" className="h-full mt-8 md:mt-0">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm font-handwritten font-bold text-yellow-800 border-2 border-yellow-200">
                        Speed
                    </div>
                    <h3 className="font-handwritten text-2xl font-bold flex items-center gap-2 text-foreground">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        IndexNow Protocol
                    </h3>
                    <p className="font-handwritten text-lg text-muted-foreground">
                    We push your URLs directly to Bing, Yandex, and Naver using the IndexNow API.
                    </p>
                </div>
            </CreativeCard>

            <CreativeCard rotate="left" className="h-full mt-8 md:mt-0">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-effect-1/20 px-3 py-1 text-sm font-handwritten font-bold text-effect-1 border-2 border-effect-1/30">
                        Analytics
                    </div>
                    <h3 className="font-handwritten text-2xl font-bold flex items-center gap-2 text-foreground">
                        <BarChart3 className="w-6 h-6 text-effect-1" />
                        Tracking & History
                    </h3>
                    <p className="font-handwritten text-lg text-muted-foreground">
                    See exactly when each URL was submitted and the response code from search engines.
                    </p>
                </div>
            </CreativeCard>
        </div>
      </div>
    </section>
  )
}

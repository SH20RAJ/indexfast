"use client";

import { CreativeCard } from '@/components/ui/creative-card'
import { Star } from 'lucide-react'

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-section transition-colors duration-300">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-handwritten text-4xl md:text-5xl font-bold mb-4 text-foreground">Loved by Makers</h2>
          <p className="font-handwritten text-xl text-muted-foreground">Don&apos;t just take our word for it.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
            <CreativeCard rotate="left" className="h-full">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-effect-2/20 flex items-center justify-center font-bold text-brand">
                        JD
                    </div>
                    <div>
                        <div className="font-bold font-handwritten text-lg">John Doe</div>
                        <div className="text-sm text-neutral-500">SEO Specialist</div>
                    </div>
                </div>
                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <p className="font-handwritten text-lg text-foreground mb-6">
                    &quot;IndexFast is a game changer. My new blog posts are indexed within minutes instead of days. It&apos;s like magic!&quot;
                </p>
            </CreativeCard>

            <CreativeCard rotate="right" className="h-full mt-8 md:mt-0">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-effect-1/20 flex items-center justify-center font-bold text-effect-1">
                        AS
                    </div>
                    <div>
                        <div className="font-bold font-handwritten text-lg">Alex Smith</div>
                        <div className="text-sm text-neutral-500">Indie Hacker</div>
                    </div>
                </div>
                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <p className="font-handwritten text-lg text-foreground mb-6">
                    &quot;Finally, a tool that actually works for SEO. The programmatic API is exactly what I needed for my programmatic SEO site.&quot;
                </p>
            </CreativeCard>

             <CreativeCard rotate="left" className="h-full mt-8 md:mt-0">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-effect-2/20 flex items-center justify-center font-bold text-brand">
                        MR
                    </div>
                    <div>
                        <div className="font-bold font-handwritten text-lg">Mike Ross</div>
                        <div className="text-sm text-neutral-500">Full Stack Dev</div>
                    </div>
                </div>
                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <p className="font-handwritten text-lg text-foreground mb-6">
                    &quot;The most &apos;set it and forget it&apos; tool in my stack. It just works. Highly recommended for any Next.js developer.&quot;
                </p>
            </CreativeCard>
        </div>
      </div>
    </section>
  )
}

import { CreativeCard } from '@/components/ui/creative-card'
import { Star } from 'lucide-react'

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-zinc-950">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-handwritten text-4xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Loved by Makers</h2>
          <p className="font-handwritten text-xl text-zinc-600 dark:text-zinc-400">Don't just take our word for it.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <CreativeCard className="h-full">
                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <p className="font-handwritten text-lg text-zinc-700 dark:text-zinc-300 mb-6">
                    "IndexFast is a game changer. My new blog posts are indexed within minutes instead of days. It's like magic!"
                </p>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                        JD
                    </div>
                    <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">John Doe</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Indie Hacker</p>
                    </div>
                </div>
            </CreativeCard>
             <CreativeCard rotate="right" className="h-full mt-4 md:mt-0">
                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <p className="font-handwritten text-lg text-zinc-700 dark:text-zinc-300 mb-6">
                    "Finally, a tool that actually works for SEO. The programmatic API is exactly what I needed for my programmatic SEO site."
                </p>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">
                        SB
                    </div>
                    <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Sarah Blake</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">SEO Specialist</p>
                    </div>
                </div>
            </CreativeCard>
             <CreativeCard className="h-full mt-4 md:mt-0">
                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <p className="font-handwritten text-lg text-zinc-700 dark:text-zinc-300 mb-6">
                    "The most 'set it and forget it' tool in my stack. It just works. Highly recommended for any Next.js developer."
                </p>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                        MR
                    </div>
                    <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Mike Ross</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Full Stack Dev</p>
                    </div>
                </div>
            </CreativeCard>
        </div>
      </div>
    </section>
  )
}

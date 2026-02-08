import { CreativeCard } from '@/components/ui/creative-card'
import { ArrowRight } from 'lucide-react'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-amber-50 dark:bg-zinc-900 transition-colors duration-300">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-handwritten text-4xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">How it Works</h2>
          <p className="font-handwritten text-xl text-zinc-600 dark:text-zinc-400">Get started in 3 simple steps.</p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 flex justify-center">
                     <div className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center text-3xl font-bold font-handwritten transform -rotate-6 shadow-lg">
                        1
                    </div>
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-2xl font-bold font-handwritten mb-2 text-zinc-900 dark:text-zinc-100">Connect GSC</h3>
                    <p className="text-lg text-zinc-600 dark:text-zinc-300 font-handwritten">
                        Log in with Google and grant access to Search Console. We'll automatically import your verified properties.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="w-full md:w-1/2 flex justify-center">
                     <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold font-handwritten transform rotate-6 shadow-lg">
                        2
                    </div>
                </div>
                <div className="w-full md:w-1/2 text-center md:text-right">
                    <h3 className="text-2xl font-bold font-handwritten mb-2 text-zinc-900 dark:text-zinc-100">Sync Sitemap</h3>
                    <p className="text-lg text-zinc-600 dark:text-zinc-300 font-handwritten">
                        We fetch your `sitemap.xml` automatically. You can also manually submit specific URLs for instant indexing.
                    </p>
                </div>
            </div>

             <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 flex justify-center">
                     <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl font-bold font-handwritten transform -rotate-3 shadow-lg">
                        3
                    </div>
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-2xl font-bold font-handwritten mb-2 text-zinc-900 dark:text-zinc-100">Get Indexed</h3>
                    <p className="text-lg text-zinc-600 dark:text-zinc-300 font-handwritten">
                        We push your links to Google, Bing, and other search engines via their APIs. Watch them go live!
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}

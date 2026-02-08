import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CreativeButton } from '@/components/ui/creative-button'
import { CreativeCard } from '@/components/ui/creative-card'

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-dot-pattern relative overflow-hidden">
      <div className="absolute top-20 left-10 animate-bounce delay-100 hidden lg:block">
        <span className="text-6xl">🚀</span>
      </div>
      <div className="absolute bottom-20 right-10 animate-bounce delay-300 hidden lg:block">
        <span className="text-6xl">⚡️</span>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4 max-w-3xl">
            <h1 className="font-handwritten text-5xl md:text-7xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 leading-tight">
              Get Indexed in <span className="text-blue-600 dark:text-blue-400 relative inline-block">Minutes
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200 dark:bg-blue-900/50 -z-10 -rotate-2"></span>
              </span>, Not Weeks
            </h1>
            <p className="mx-auto max-w-[700px] font-handwritten text-xl md:text-2xl text-zinc-600 dark:text-zinc-400">
              Automatically submit your new content to Google, Bing, and Yandex. 
              Connect your Search Console and let us handle the rest.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
                <CreativeButton size="lg" className="h-14 px-8 text-xl">
                Start Indexing <ArrowRight className="ml-2 h-5 w-5" />
                </CreativeButton>
            </Link>
            <Link href="#how-it-works">
                <CreativeButton variant="outline" size="lg" className="h-14 px-8 text-xl border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800">
                How it Works
                </CreativeButton>
            </Link>
          </div>
          
          <div className="mt-16 w-full max-w-5xl mx-auto">
             <CreativeCard rotate="none" className="bg-white dark:bg-zinc-900 p-2 shadow-2xl">
                 <div className="aspect-video w-full rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                         <span className="text-9xl">📊</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 w-full max-w-4xl z-10">
                        <div className="bg-white dark:bg-zinc-950 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-xl">✅</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg dark:text-zinc-200">Page Indexed</p>
                                    <p className="text-sm text-zinc-500">Google • Just now</p>
                                </div>
                            </div>
                            <div className="h-2 bg-green-100 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full animate-pulse"></div>
                            </div>
                        </div>
                        
                         <div className="bg-white dark:bg-zinc-950 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-xl">⚡️</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg dark:text-zinc-200">Sitemap Synced</p>
                                    <p className="text-sm text-zinc-500">IndexNow • 2m ago</p>
                                </div>
                            </div>
                            <div className="h-2 bg-blue-100 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[80%] animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                 </div>
             </CreativeCard>
          </div>
        </div>
      </div>
    </section>
  )
}

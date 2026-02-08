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
            <h1 className="font-handwritten text-5xl md:text-7xl font-bold tracking-tighter text-zinc-900 leading-tight">
              Get Indexed in <span className="text-blue-600 relative inline-block">Minutes
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200 -z-10 -rotate-2"></span>
              </span>, Not Weeks
            </h1>
            <p className="mx-auto max-w-[700px] font-handwritten text-xl md:text-2xl text-zinc-600">
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
                <CreativeButton variant="outline" size="lg" className="h-14 px-8 text-xl">
                How it Works
                </CreativeButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

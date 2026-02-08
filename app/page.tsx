
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Zap, BarChart3 } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IndexFast - Get Indexed in Minutes',
  description: 'The ultimate tool for SEO professionals and content creators to instantly index new pages on Google and Bing.',
}


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center font-bold text-xl" href="#">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" />
          IndexFast
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Sign In
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Get Indexed in <span className="text-blue-600">Minutes</span>, Not Weeks
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Automatically submit your new content to Google, Bing, and Yandex. 
                  Connect your Search Console and let us handle the rest.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                    <Button size="lg" className="h-12 px-8">
                    Start Indexing <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <Link href="#how-it-works">
                    <Button variant="outline" size="lg" className="h-12 px-8">
                    How it Works
                    </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-3">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                    Integration
                </div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Google Search Console
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  One-click import of all your verified sites. We verify ownership automatically.
                </p>
              </div>
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                    Speed
                </div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    IndexNow Protocol
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We push your URLs directly to Bing, Yandex, and Naver using the IndexNow API.
                </p>
              </div>
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                    Analytics
                </div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    Tracking & History
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  See exactly when each URL was submitted and the response code from search engines.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Pricing</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Start for free. Upgrade as you grow.
                </p>
              </div>
            </div>
            <div className="grid max-w-sm gap-8 items-start mx-auto mt-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-2">
                <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-center">Free</h3>
                    <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
                        <span className="text-4xl font-bold">$0</span>/ month
                    </div>
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-center">
                            <CheckCircle2 className="text-green-500 w-4 h-4 mr-2" />
                            1 Site
                        </li>
                        <li className="flex items-center">
                            <CheckCircle2 className="text-green-500 w-4 h-4 mr-2" />
                            10 Submissions / day
                        </li>
                        <li className="flex items-center">
                            <CheckCircle2 className="text-green-500 w-4 h-4 mr-2" />
                            Manual Sync
                        </li>
                    </ul>
                    <Link href="/login" className="mt-6">
                        <Button className="w-full" variant="outline">Get Started</Button>
                    </Link>
                </div>
                <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-gray-850 border-2 border-blue-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1">POPULAR</div>
                    <h3 className="text-2xl font-bold text-center">Pro</h3>
                    <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
                        <span className="text-4xl font-bold">$19</span>/ month
                    </div>
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-center">
                            <CheckCircle2 className="text-green-500 w-4 h-4 mr-2" />
                            Unknown Sites
                        </li>
                        <li className="flex items-center">
                            <CheckCircle2 className="text-green-500 w-4 h-4 mr-2" />
                            Unlimited Submissions
                        </li>
                        <li className="flex items-center">
                            <CheckCircle2 className="text-green-500 w-4 h-4 mr-2" />
                            Auto-Sync (Daily)
                        </li>
                    </ul>
                    <Link href="/login" className="mt-6">
                        <Button className="w-full">Upgrade</Button>
                    </Link>
                </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 IndexFast. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

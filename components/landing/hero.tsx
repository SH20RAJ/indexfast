"use client";
import Link from 'next/link'
import { ArrowRight, Check, Zap } from 'lucide-react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-neutral-950 antialiased">
      <BackgroundBeams className="opacity-40" />
      
      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 backdrop-blur-sm"
        >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: IndexNow API Integration
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6 max-w-4xl mx-auto">
          Get Indexed in <br/>
          <span className="text-blue-500">Minutes</span>, Not Weeks.
        </h1>

        {/* Subheadline with Typing Effect */}
        <div className="max-w-2xl mx-auto mb-10 h-20 md:h-24">
            <TextGenerateEffect 
                words="Automatically submit your content to Google, Bing, and Yandex. Stop waiting for crawlers. Push your URLs to the index instantly."
                className="text-lg md:text-xl text-neutral-400 font-normal"
            />
        </div>

        {/* CTA Buttons */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
            <Link href="/login">
                <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span className="absolute inset-[-1000%] animate-[shimmer_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-slate-900">
                        Start Indexing Free <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                </button>
            </Link>
            <Link href="#how-it-works">
                <button className="px-8 py-3 rounded-full border border-neutral-800 text-neutral-300 bg-neutral-900/50 hover:bg-neutral-900 transition-colors backdrop-blur-sm text-sm font-medium">
                    How it Works
                </button>
            </Link>
        </motion.div>

        {/* Floating Visual */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 relative w-full max-w-5xl"
        >
            {/* Glow behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
            
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                
                {/* Mock Browser/App Interface */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    <div className="ml-4 px-3 py-1 bg-neutral-800 rounded-md text-xs text-neutral-500 font-mono w-64 flex items-center">
                        <span className="text-blue-500 mr-2">GET</span> https://api.indexfast.com/v1/submit
                    </div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-grid-white/[0.02]">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <Check className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-green-500 font-medium">Google Indexing</div>
                                <div className="text-green-500/60 text-sm">Successfully submitted 12 URLs</div>
                            </div>
                        </div>
                         <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-blue-500 font-medium">IndexNow Sync</div>
                                <div className="text-blue-500/60 text-sm">Bing & Yandex notified instantly</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Code Snippet Visual */}
                    <div className="relative rounded-lg bg-black p-4 font-mono text-xs md:text-sm text-neutral-400 overflow-hidden border border-neutral-800">
                        <div className="mb-2 text-neutral-500">// Response</div>
                        <div className="text-green-400">{"{"}</div>
                        <div className="pl-4">
                            <span className="text-purple-400">&quot;status&quot;</span>: <span className="text-blue-400">&quot;success&quot;</span>,
                        </div>
                        <div className="pl-4">
                             <span className="text-purple-400">&quot;indexed_urls&quot;</span>: <span className="text-yellow-400">12</span>,
                        </div>
                        <div className="pl-4">
                             <span className="text-purple-400">&quot;time_taken&quot;</span>: <span className="text-blue-400">&quot;450ms&quot;</span>
                        </div>
                        <div className="text-green-400">{"}"}</div>
                        
                        {/* Scanning beam */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_20px_2px_rgba(59,130,246,0.5)] animate-[accordion-down_2s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  )
}

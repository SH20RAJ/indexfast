
"use client";
import Link from 'next/link'
import { ArrowRight, Check, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-zinc-950 antialiased pt-20">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8 backdrop-blur-sm"
        >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Full IndexNow Integration
        </motion.div>

        {/* Headline */}
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 max-w-5xl mx-auto"
        >
           Start Ranking <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Faster.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="text-lg md:text-xl text-zinc-400 font-normal max-w-2xl mx-auto mb-10 leading-relaxed"
        >
             Stop waiting weeks for search engines to crawl your site. <br className="hidden md:block"/>
             Push your URLs to Google, Bing, and Yandex instantly.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-20"
        >
            <Link href="/login">
                <button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
                    Start Indexing Free <ArrowRight className="w-4 h-4" />
                </button>
            </Link>
            <Link href="#how-it-works">
                <button className="h-12 px-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors font-medium">
                    How it Works
                </button>
            </Link>
        </motion.div>

        {/* Minimal Visual - Just a search bar simulation */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative w-full max-w-2xl mx-auto"
        >
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-2xl blur-xl opacity-20"></div>
             <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
                 <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-zinc-700/50"></div>
                        <div className="w-3 h-3 rounded-full bg-zinc-700/50"></div>
                        <div className="w-3 h-3 rounded-full bg-zinc-700/50"></div>
                     </div>
                 </div>
                 <div className="p-4 md:p-6 bg-zinc-950 flex items-center gap-4">
                      <Search className="w-5 h-5 text-zinc-500" />
                      <div className="flex-1 font-mono text-sm text-zinc-400 truncate">
                         https://your-awesome-site.com/new-post
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                          <Check className="w-3 h-3" /> Indexed
                      </div>
                 </div>
             </div>
        </motion.div>

      </div>
    </section>
  )
}

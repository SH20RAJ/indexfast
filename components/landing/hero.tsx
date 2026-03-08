
"use client";
import Link from 'next/link'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0B] antialiased pt-20 pb-20">
      
      {/* Background Grid - Ultra Subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] opacity-50" />
      
      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
        
        {/* Status Badge */}
        <motion.div 
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-12 backdrop-blur-md"
        >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse" />
            Live · IndexNow API Integration
        </motion.div>

        {/* Massive Headline */}
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-white mb-6 max-w-7xl mx-auto leading-[0.85]"
        >
           Rank <span className="text-zinc-600">Instantly.</span>
        </motion.h1>

        {/* Strong Value Prop */}
        <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl mx-auto mb-14 leading-relaxed"
        >
             Stop waiting weeks for search engines. Push your URLs directly to Google, Bing, and Yandex the moment you hit publish.<br className="hidden md:block"/> No indexing delays.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16"
        >
            <Link href="/login">
                <button className="h-14 px-10 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                    Start Indexing For Free
                </button>
            </Link>
        </motion.div>

        {/* Dashboard/Console Mockup - Ultra Clean */}
        <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-4xl mx-auto px-4"
        >
             <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-transparent rounded-2xl blur-2xl opacity-50 z-0"></div>
             
             <div className="relative z-10 bg-[#0F0F11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl">
                 <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                        <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                        <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                     </div>
                     <div className="text-[10px] text-zinc-600 font-mono tracking-[0.2em] uppercase">Status Output</div>
                 </div>
                 <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-1 w-full bg-black/60 border border-white/5 rounded-xl px-5 py-4 font-mono text-sm text-zinc-400 overflow-hidden text-ellipsis text-left shadow-inner">
                         <span className="text-green-500 mr-2">➜</span> https://unstory.app/blog/next-js-optimization
                      </div>
                      <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-green-500/10 text-green-400 text-sm font-bold border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                          <Check className="w-4 h-4" /> Successfully Submitted
                      </div>
                 </div>
             </div>
        </motion.div>

      </div>
    </section>
  )
}

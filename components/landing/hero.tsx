
"use client";
import Link from 'next/link'
import { ArrowRight, Check, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0B] antialiased pt-20">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-zinc-400 text-xs font-medium mb-12 backdrop-blur-md"
        >
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            Full IndexNow Integration
        </motion.div>

        {/* Headline */}
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-8 max-w-6xl mx-auto leading-[0.9]"
        >
           Rank <span className="text-zinc-500">Faster.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="text-lg md:text-xl text-zinc-500 font-medium max-w-xl mx-auto mb-12 leading-relaxed"
        >
             Instantly push your content to Google, Bing, and Yandex. <br className="hidden md:block"/>
             No setup, just results.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-24"
        >
            <Link href="/login">
                <button className="h-12 px-10 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                    Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
            </Link>
            <Link href="#how-it-works">
                <button className="h-12 px-10 rounded-full bg-transparent border border-white/10 text-white hover:bg-white/5 transition-all font-semibold">
                    Learn More
                </button>
            </Link>
        </motion.div>

        {/* Minimal Tool Mockup */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative w-full max-w-3xl mx-auto px-4"
        >
             <div className="relative bg-zinc-900/50 border border-white/5 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                 <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                     </div>
                     <div className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">Console</div>
                 </div>
                 <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-1 w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 font-mono text-sm text-zinc-500 overflow-hidden text-ellipsis">
                         https://unstory.app/blog/next-js-optimization
                      </div>
                      <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                          <Check className="w-3.5 h-3.5" /> Indexed
                      </div>
                 </div>
             </div>
        </motion.div>

      </div>
    </section>
  )
}

"use client";

import { motion } from "framer-motion";
import { Search, Command as CommandIcon, Zap, Target, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContextSearchFeature() {
  return (
    <section className="py-24 md:py-32 bg-[#0A0A0B] relative overflow-hidden flex flex-col items-center">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            <CommandIcon className="w-3 h-3" />
            <span>New Feature</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-3xl">
            Navigate your SEO strategy <br /> <span className="text-zinc-500">at the speed of thought.</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl">
            Introducing Context Search. A keyboard-first command palette that lets you manage sites, track history, and access tools without leaving your home row.
          </p>
        </div>

        {/* Command Palette Mockup */}
        <div className="relative max-w-4xl mx-auto">
          {/* Decorative Cursor */}
          <motion.div
            animate={{ 
              x: [100, 300, 200, 150], 
              y: [50, 150, 100, 80],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute z-50 pointer-events-none hidden md:block"
          >
            <MousePointer2 className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] fill-blue-500" />
          </motion.div>

          {/* Mockup Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Command Bar */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5 bg-white/[0.02]">
              <Search className="w-5 h-5 text-zinc-500" />
              <div className="flex-1 text-zinc-300 font-medium">Search properties...</div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 rounded bg-zinc-800 border border-white/10 text-[10px] text-zinc-400 font-bold">⌘</kbd>
                <kbd className="px-2 py-1 rounded bg-zinc-800 border border-white/10 text-[10px] text-zinc-400 font-bold">K</kbd>
              </div>
            </div>

            {/* Mocked Results */}
            <div className="p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Quick Actions</div>
              <ResultItem icon={<Zap className="w-4 h-4 text-yellow-500" />} text="Instant Index Sitemaps" shortcut="S" />
              <ResultItem icon={<Target className="w-4 h-4 text-blue-500" />} text="Verify New Property" shortcut="V" />
              
              <div className="pt-3 pb-1 px-3 py-1.5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Recent Sites</div>
              <ResultItem 
                icon={<div className="w-4 h-4 rounded-sm bg-blue-500/20 border border-blue-500/30" />} 
                text="unstory.app" 
                active 
              />
              <ResultItem 
                icon={<div className="w-4 h-4 rounded-sm bg-zinc-800 border border-white/5" />} 
                text="portfolio.design" 
              />
              <ResultItem 
                icon={<div className="w-4 h-4 rounded-sm bg-zinc-800 border border-white/5" />} 
                text="blog.marketing.io" 
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-black/20 flex justify-between items-center">
               <div className="flex gap-4">
                  <span className="text-[10px] text-zinc-600 flex items-center gap-1"><kbd className="bg-zinc-800 px-1 rounded">Enter</kbd> to select</span>
                  <span className="text-[10px] text-zinc-600 flex items-center gap-1"><kbd className="bg-zinc-800 px-1 rounded">Esc</kbd> to close</span>
               </div>
               <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-tighter">Placer Command Engine v1.0</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ResultItem({ icon, text, shortcut, active = false }: { icon: React.ReactNode, text: string, shortcut?: string, active?: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between px-3 py-3 rounded-xl transition-colors group cursor-default",
      active ? "bg-white/5 border border-white/10" : "hover:bg-white/[0.02]"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex-shrink-0 transition-transform",
          active && "scale-110"
        )}>
          {icon}
        </div>
        <span className={cn(
          "text-sm transition-colors",
          active ? "text-white font-medium" : "text-zinc-400 group-hover:text-zinc-200"
        )}>{text}</span>
      </div>
      {shortcut && (
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800/50 border border-white/5 text-[9px] text-zinc-600 font-mono">
          {shortcut}
        </kbd>
      )}
    </div>
  )
}

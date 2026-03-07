"use client";

import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Connect Your Site",
    description: "Sign in with Google and grant access to Search Console. We automatically import all your verified properties."
  },
  {
    number: "02",
    title: "Sync Your Content",
    description: "We fetch your sitemap.xml automatically and monitor for new pages. Or manually submit specific URLs."
  },
  {
    number: "03",
    title: "Watch It Index",
    description: "Your URLs are pushed to Google, Bing, and Yandex via their APIs. Track status in real-time."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-32 bg-[#0A0A0B] overflow-hidden">
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-24"
        >
          <div className="text-zinc-500 font-mono text-[10px] tracking-[0.2em] uppercase mb-4">
            The Process
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Get indexed <br /> in three steps.
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
          {steps.map((step, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col group"
              >
                <div className="mb-6 flex items-baseline gap-4">
                    <span className="text-xs font-mono text-zinc-700 font-bold tracking-tighter group-hover:text-blue-500 transition-colors">
                        {step.number}
                    </span>
                    <div className="w-full h-px bg-white/5" />
                </div>
                
                <div className="flex flex-col gap-4">
                   <h3 className="text-xl font-bold text-zinc-100">
                     {step.title}
                   </h3>
                   <p className="text-zinc-500 text-sm leading-relaxed">
                     {step.description}
                   </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

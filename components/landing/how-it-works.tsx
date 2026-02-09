"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ArrowRight, Link as LinkIcon, Rocket } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Connect Your Site",
    description: "Sign in with Google and grant access to Search Console. We automatically import all your verified properties in one click.",
    icon: LinkIcon,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    number: "02",
    title: "Sync Your Content",
    description: "We fetch your sitemap.xml automatically and monitor for new pages. Or manually submit specific URLs for instant processing.",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  },
  {
    number: "03",
    title: "Watch It Index",
    description: "Your URLs are pushed to Google, Bing, and Yandex via their APIs. Track indexing status in real-time from your dashboard.",
    icon: Rocket,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-24 md:py-32 bg-zinc-950 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            How It Works
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Get your content indexed in three simple steps. No technical knowledge required.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-1/2 top-32 w-0.5 h-24 bg-gradient-to-b from-zinc-700 to-transparent -translate-x-1/2 z-0" />
                )}
                
                <div className="flex flex-col md:flex-row items-center gap-8 mb-16 md:mb-24">
                  {/* Step Number & Icon */}
                  <div className={`relative flex items-center justify-center w-full md:w-1/3 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="relative">
                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-20 animate-pulse`}></div>
                      
                      {/* Main Card */}
                      <div className={`relative ${step.bgColor} ${step.borderColor} border rounded-2xl p-8 backdrop-blur-sm`}>
                        <div className="flex items-center justify-center gap-4">
                          <span className="text-6xl font-bold text-white opacity-20">{step.number}</span>
                          <div className={`p-4 rounded-xl bg-gradient-to-br ${step.color}`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`w-full md:w-2/3 ${index % 2 === 0 ? 'md:order-2 md:text-left' : 'md:order-1 md:text-right'} text-center`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    >
                      <h3 className="text-3xl font-bold text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-lg text-zinc-400 leading-relaxed max-w-lg mx-auto md:mx-0">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.7)]">
            Start Indexing For Free
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="mt-4 text-sm text-zinc-500">No credit card required • 100 URLs free</p>
        </motion.div>
      </div>
    </section>
  );
}

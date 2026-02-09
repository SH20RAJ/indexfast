"use client";

import { CredentialSignIn, CredentialSignUp } from "@stackframe/stack";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-neutral-950 overflow-hidden font-sans">
      <BackgroundBeams className="opacity-40" />
      
      {/* Musical/Creative Visuals */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-effect-1/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-effect-2/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
            {/* animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[1.5s] pointer-events-none" />

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 font-handwritten">
                    {isLogin ? "Welcome Back" : "Join the Rhythm"}
                </h2>
                <p className="text-neutral-400 text-sm mt-2">
                    {isLogin ? "Sign in to access your dashboard" : "Start indexing in minutes"}
                </p>
            </div>

            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                             <CredentialSignIn />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CredentialSignUp />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
                >
                    {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { AvailabilityBadge } from "@/components/availability-badge";

export function HeroSection() {
  return (
    <section id="top" className="min-h-screen flex items-center justify-center container-padding relative">
      <div className="max-w-5xl mx-auto w-full text-center pt-24 pb-16">
        
        {/* Badge */}
        <AvailabilityBadge
          animated
          className="px-5 py-2.5 font-medium mb-10"
          dotClassName="bg-green-500"
          text="AVAILABLE FOR PROJECTS"
          year="2026"
        />

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="font-extrabold tracking-tight leading-[1.05] mb-8"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "clamp(40px, 8vw, 85px)" }}
        >
          <span className="text-slate-900 dark:text-white">HI, I&apos;M </span>
          <span className="text-blue-600">SAMS</span>
          <br />
          <span className="text-slate-400 dark:text-slate-600">FULL STACK</span>
          <span className="text-slate-900 dark:text-white"> ENGINEER</span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          I build <span className="text-slate-900 dark:text-white font-semibold">scalable web products</span> with 
          Spring Boot, React & Vue.js that perform and don&apos;t break.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <a 
            href="#work" 
            className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/25"
          >
            VIEW MY WORK
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:border-slate-900 dark:hover:border-white transition-all duration-200"
          >
            <Mail className="h-5 w-5" />
            GET IN TOUCH
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mx-auto w-full max-w-3xl"
        >
          {/* Mobile: 1-column cards. Desktop: 3 columns with dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            <div className="text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/[0.03] px-4 py-4">
              <div className="text-4xl sm:text-4xl md:text-5xl font-black text-blue-600">3+</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Years Experience</div>
            </div>

            <div className="text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/[0.03] px-4 py-4">
              <div className="text-4xl sm:text-4xl md:text-5xl font-black text-blue-600">200+</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Issues Resolved</div>
            </div>

            <div className="text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/[0.03] px-4 py-4">
              <div className="text-4xl sm:text-4xl md:text-5xl font-black text-blue-600">40%</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Performance Boost</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-slate-300 dark:border-slate-600 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-slate-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

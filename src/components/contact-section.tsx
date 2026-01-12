"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getUser } from "@/lib/content/user";

export function ContactSection() {
  const userData = getUser();

  return (
    <section id="contact" className="py-24 px-6 bg-slate-100 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm mb-10">
            <span>AVAILABLE FOR PROJECTS</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>2026</span>
          </div>

          {/* Large Heading */}
          <h2 
            className="font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-8"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "clamp(42px, 7vw, 80px)" }}
          >
            LET&apos;S <span className="text-blue-600">CONNECT</span><br />
            <span className="text-slate-400 dark:text-slate-600">TO BUILD YOUR</span><br />
            NEXT <span className="text-blue-600">IDEA</span>
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href={`mailto:${userData.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              BOOK A CALL
            </a>
            <a
              href={`mailto:${userData.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
            >
              EMAIL ME
            </a>
          </div>

          {/* Footer Link */}
          <div className="flex items-center gap-2 text-slate-900 dark:text-white text-xl font-medium">
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

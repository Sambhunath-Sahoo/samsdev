"use client";

import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";

export function PageLoader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Animated logo/spinner */}
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 flex items-center justify-center animate-pulse">
              <span className="text-2xl font-black text-white">S</span>
            </div>
            <div className="absolute -inset-2 rounded-3xl border-2 border-blue-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          </div>
          
          {/* Loading text */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-base font-semibold text-slate-900 dark:text-white">Loading</span>
            <span className="text-base font-semibold text-blue-600 inline-block w-6 text-left">{dots}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

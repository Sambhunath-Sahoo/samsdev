"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Rail } from "@/components/section-shell";

const SKELETON_WIDTHS = ["w-2/3", "w-1/2", "w-5/6", "w-1/3"] as const;

function Skeleton({ className = "", isPill = false }: { className?: string; isPill?: boolean }) {
  return (
    <div aria-busy="true" aria-live="polite" className={`flex max-w-3xl flex-col gap-4 ${className}`}>
      <span className="sr-only">Loading content</span>
      {SKELETON_WIDTHS.map((width, i) => (
        <div
          key={width}
          className={`h-10 animate-pulse ${isPill ? "rounded-full" : ""} bg-bg-sunken motion-reduce:animate-none ${width}`}
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

export function PageLoader() {
  const isRoadmap = usePathname().startsWith("/roadmap");

  if (!isRoadmap) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="band-lav pub-band pub-band--hero min-h-screen">
          <div className="pub-wrap">
            <p className="hud text-muted">Loading</p>
            <Skeleton isPill className="mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Rail className="min-h-[calc(100vh-var(--nav-h))]">
        <div className="section-bar">
          <p className="hud text-muted">
            <span className="text-faint">00</span>
            <span className="mx-2 text-faint">/</span>
            Loading
          </p>
        </div>
        <div className="section-pad">
          <Skeleton />
        </div>
      </Rail>
    </div>
  );
}

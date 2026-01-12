"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type AvailabilityBadgeProps = {
  text?: string;
  year?: string | number;
  /**
   * - "hero": dot + single string "TEXT • YEAR"
   * - "split": separate nodes: TEXT + dot + YEAR
   */
  layout?: "hero" | "split";
  /** When true, applies the Hero-style entrance animation. */
  animated?: boolean;
  className?: string;
  dotClassName?: string;
};

export function AvailabilityBadge({
  text = "AVAILABLE FOR PROJECTS",
  year = "2026",
  layout = "hero",
  animated = false,
  className,
  dotClassName,
}: AvailabilityBadgeProps) {
  const Comp = animated ? motion.div : "div";

  const baseClassName = cn(
    "inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm",
    className,
  );

  const dot = (
    <span
      className={cn("w-2 h-2 rounded-full animate-pulse", dotClassName ?? "bg-green-500")}
    />
  );

  const content =
    layout === "split" ? (
      <>
        <span>{text}</span>
        {dot}
        <span>{year}</span>
      </>
    ) : (
      <>
        {dot}
        {text} • {year}
      </>
    );

  return (
    <Comp
      {...(animated
        ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
          }
        : {})}
      className={baseClassName}
    >
      {content}
    </Comp>
  );
}



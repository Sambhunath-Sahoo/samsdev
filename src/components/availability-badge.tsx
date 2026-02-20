"use client";

import { cn } from "@/lib/utils";

type AvailabilityBadgeProps = {
  text?: string;
  year?: string | number;
  layout?: "hero" | "split";
  animated?: boolean;
  className?: string;
  dotClassName?: string;
};

export function AvailabilityBadge({
  text = "AVAILABLE FOR PROJECTS",
  year = "2026",
  layout = "hero",
  className,
  dotClassName,
}: AvailabilityBadgeProps) {
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
    <div className={baseClassName}>
      {content}
    </div>
  );
}

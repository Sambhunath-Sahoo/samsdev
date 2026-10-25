import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className, mark = false, compact = false }: { className?: string; mark?: boolean; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="sams.dev home"
      className={cn(
        "flex items-center gap-2 font-display text-[15px] tracking-[-0.01em] text-ink-strong transition-opacity hover:opacity-70",
        className,
      )}
    >
      {mark ? (
        <span aria-hidden="true" className={cn("grid place-items-center rounded-full bg-[#5e6ad2] leading-none text-white", compact ? "h-8 w-8 text-base" : "h-10 w-10 text-lg")}>
          s
        </span>
      ) : (
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
      )}
      <span className={mark ? (compact ? "text-[17px]" : "text-xl") : undefined}>
        sams<span className="text-accent-ink">.dev</span>
      </span>
    </Link>
  );
}

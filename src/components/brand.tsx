import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="sams.dev home"
      className={cn(
        "flex items-center gap-2.5 font-display text-[15px] font-semibold tracking-[-0.02em] text-ink-strong transition-opacity hover:opacity-70",
        className,
      )}
    >
      <span aria-hidden="true" className="h-2 w-2 bg-accent" />
      sams<span className="text-accent-ink">.dev</span>
    </Link>
  );
}

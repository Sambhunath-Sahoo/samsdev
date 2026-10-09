"use client";

import { useState } from "react";

const RESET_DELAY_MS = 1600;

type CopyState = "idle" | "copied" | "failed";

const LABELS: Record<CopyState, string> = {
  idle: "Copy",
  copied: "Copied",
  failed: "Select it",
};

export function CopyButton({ value, className = "" }: { value: string; className?: string }) {
  const [state, setState] = useState<CopyState>("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), RESET_DELAY_MS);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`hud font-bold text-muted transition-colors hover:bg-invert-bg hover:text-invert-fg ${className}`}
    >
      {LABELS[state]}
    </button>
  );
}

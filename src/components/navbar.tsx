"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Github, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Brand } from "@/components/brand";
import { cn } from "@/lib/utils";
import socials from "@/data/socials.json";

const NAV = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/#work" },
  { name: "Experience", href: "/#experience" },
  { name: "Services", href: "/#services" },
  { name: "Stack", href: "/#stack" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/#contact" },
] as const;

const GITHUB_URL = socials.find((s) => s.name === "GitHub")?.href ?? "https://github.com/Sambhunath-Sahoo";

const iconCell =
  "flex w-12 items-center justify-center border-l border-line text-muted transition-colors hover:bg-invert-bg hover:text-invert-fg";

export function Navbar() {
  const { toggleTheme } = useTheme();
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState<string>(pathname);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const syncActiveHref = () => {
      const hash = window.location.hash;
      setActiveHref(pathname === "/" && hash ? `/${hash}` : pathname);
    };
    syncActiveHref();
    window.addEventListener("hashchange", syncActiveHref, { passive: true });
    return () => window.removeEventListener("hashchange", syncActiveHref);
  }, [pathname]);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/95 backdrop-blur-sm">
      <div className="rail flex h-12 items-stretch">
        <Brand className="border-r border-line px-4 sm:px-5" />

        <nav aria-label="Primary" className="hidden min-w-0 items-stretch lg:flex">
          {NAV.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActiveHref(item.href)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "hud group flex items-center whitespace-nowrap px-2.5",
                  isActive ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "flex items-center px-1.5 py-0.5 group-hover:bg-invert-bg group-hover:text-invert-fg",
                    isActive && "bg-invert-bg text-invert-fg",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconCell}>
          <Github className="h-4 w-4" />
        </a>

        <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className={iconCell}>
          <Moon className="h-4 w-4 dark:hidden" />
          <Sun className="hidden h-4 w-4 dark:block" />
        </button>

        <Link
          href="/#contact"
          onClick={() => setActiveHref("/#contact")}
          className="btn btn-primary mx-2.5 my-auto hidden h-8 px-3.5 text-[11px] sm:inline-flex"
        >
          Let&apos;s talk
        </Link>

        <button
          type="button"
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-label={isMobileOpen ? "Close main menu" : "Open main menu"}
          aria-expanded={isMobileOpen}
          className={cn(iconCell, "lg:hidden")}
        >
          {isMobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {isMobileOpen && (
        <nav aria-label="Mobile" className="rail border-t border-line lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                setActiveHref(item.href);
                closeMobile();
              }}
              className="hud block border-b border-line px-6 py-3 text-muted transition-colors last:border-b-0 hover:bg-invert-bg hover:text-invert-fg"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

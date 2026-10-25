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
  { name: "Roadmap", href: "/roadmap" },
] as const;

const GITHUB_URL = socials.find((s) => s.name === "GitHub")?.href ?? "https://github.com/Sambhunath-Sahoo";

function isItemActive(activeHref: string, href: string): boolean {
  if (activeHref === href) return true;
  return !href.includes("#") && href !== "/" && activeHref.startsWith(`${href}/`);
}

function useActiveHref(pathname: string) {
  const [activeHref, setActiveHref] = useState<string>(pathname);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      setActiveHref(pathname === "/" && hash ? `/${hash}` : pathname);
    };
    sync();
    window.addEventListener("hashchange", sync, { passive: true });
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return [activeHref, setActiveHref] as const;
}

const SCROLL_THRESHOLD_PX = 24;

/** True once the page has scrolled past the top, so the nav can change shape. */
function useIsScrolled(): boolean {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return isScrolled;
}

const TICKER_ITEMS = ["Full stack", "AI features", "DevOps notes", "System design", "Available for projects 2026"] as const;

/** Thin black strip above the nav at the top of public pages. Scrolls away with the page. */
function Ticker() {
  const row = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="band-ink pub-ticker" aria-hidden="true">
      <div className="pub-ticker-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="pub-ticker-row">
            {row.map((item, i) => (
              <span key={`${copy}-${i}`} className="pub-ticker-item">
                {item}
                <span className="pub-ticker-sep">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type NavProps = {
  activeHref: string;
  onNavigate: (href: string) => void;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
  onToggleTheme: () => void;
};

function ThemeIcons() {
  return (
    <>
      <Moon className="h-4 w-4 dark:hidden" />
      <Sun className="hidden h-4 w-4 dark:block" />
    </>
  );
}

/** Public pages: flat on the hero at the top, a floating black rounded bar once scrolled. */
function PillNav({ activeHref, onNavigate, isMobileOpen, onToggleMobile, onToggleTheme }: NavProps) {
  const isScrolled = useIsScrolled();
  const iconButton =
    "flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:text-ink";

  return (
    <>
      <Ticker />
      <header className="sticky top-0 z-50 h-0">
        <div className="mx-auto w-full max-w-[1280px] px-4 pt-3 sm:px-6">
          <div className="relative">
            <div
              className={cn(
                "pub-bar flex items-center gap-2 rounded-[28px] border py-3 pl-4 pr-3",
                isScrolled ? "band-ink pub-nav" : "band-lav border-transparent",
              )}
            >
              <Brand mark />

              <nav aria-label="Primary" className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
                {NAV.map((item) => {
                  const isActive = isItemActive(activeHref, item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => onNavigate(item.href)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "whitespace-nowrap rounded-full px-3 py-1.5 text-[15px] font-medium transition-colors",
                        isActive ? "text-accent-ink underline decoration-2 underline-offset-8" : "text-ink hover:text-accent-ink",
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex-1 lg:hidden" />

              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconButton}>
                <Github className="h-[18px] w-[18px]" />
              </a>
              <button type="button" onClick={onToggleTheme} aria-label="Toggle theme" className={iconButton}>
                <ThemeIcons />
              </button>
              <Link
                href="/#contact"
                onClick={() => onNavigate("/#contact")}
                className={cn(
                  "btn btn-sm hidden h-11 rounded-full px-5 text-[15px] sm:inline-flex",
                  isScrolled ? "btn-primary" : "border border-line-strong text-ink hover:bg-invert-bg hover:text-invert-fg",
                )}
              >
                Let&apos;s talk
              </Link>
              <button
                type="button"
                onClick={onToggleMobile}
                aria-label={isMobileOpen ? "Close main menu" : "Open main menu"}
                aria-expanded={isMobileOpen}
                className={cn(iconButton, "lg:hidden")}
              >
                {isMobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
              </button>
            </div>

            {isMobileOpen && (
              <nav aria-label="Mobile" className="band-ink pub-nav absolute inset-x-0 top-full mt-2 grid gap-0.5 rounded-3xl p-2 lg:hidden">
                {NAV.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => onNavigate(item.href)}
                    className="rounded-full px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-raised"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/#contact" onClick={() => onNavigate("/#contact")} className="btn btn-primary mt-1 w-full sm:hidden">
                  Let&apos;s talk
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

/** Roadmap pages: flat app bar with a round logo, normal-case links and a pale lavender pill on the active one. */
function FlatNav({ activeHref, onNavigate, isMobileOpen, onToggleMobile, onToggleTheme }: NavProps) {
  const iconButton =
    "flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-bg-raised text-muted transition-colors hover:bg-tint-lav hover:text-ink";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/95 backdrop-blur-sm">
      <div className="flex h-14 items-center gap-1 px-4 sm:px-6">
        <Brand mark compact className="mr-3" />

        <nav aria-label="Primary" className="hidden min-w-0 items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const isActive = isItemActive(activeHref, item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onNavigate(item.href)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-tint-lav text-ink" : "text-muted hover:bg-tint-lav/60 hover:text-ink",
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconButton}>
            <Github className="h-4 w-4" />
          </a>
          <button type="button" onClick={onToggleTheme} aria-label="Toggle theme" className={iconButton}>
            <ThemeIcons />
          </button>
          <Link
            href="/#contact"
            onClick={() => onNavigate("/#contact")}
            className="hidden h-10 items-center rounded-lg border border-line-strong bg-bg-raised px-4 text-sm font-medium text-ink transition-colors hover:bg-tint-lav sm:inline-flex"
          >
            Let&apos;s talk
          </Link>
          <button
            type="button"
            onClick={onToggleMobile}
            aria-label={isMobileOpen ? "Close main menu" : "Open main menu"}
            aria-expanded={isMobileOpen}
            className={cn(iconButton, "lg:hidden")}
          >
            {isMobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <nav aria-label="Mobile" className="grid gap-1 border-t border-line bg-bg p-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onNavigate(item.href)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-tint-lav"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Navbar() {
  const { toggleTheme } = useTheme();
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useActiveHref(pathname);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavigate = useCallback(
    (href: string) => {
      setActiveHref(href);
      setIsMobileOpen(false);
    },
    [setActiveHref],
  );
  const handleToggleMobile = useCallback(() => setIsMobileOpen((open) => !open), []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  const props: NavProps = {
    activeHref,
    onNavigate: handleNavigate,
    isMobileOpen,
    onToggleMobile: handleToggleMobile,
    onToggleTheme: toggleTheme,
  };

  return pathname.startsWith("/roadmap") ? <FlatNav {...props} /> : <PillNav {...props} />;
}

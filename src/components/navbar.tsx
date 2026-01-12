"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const NAV = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Work", href: "/#work" },
  { name: "Services", href: "/#services" },
  { name: "Technologies", href: "/#stack" },
  { name: "Contact", href: "/#contact" },
] as const;

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const syncActiveHref = () => {
      const hash = window.location.hash; // includes leading '#'
      setActiveHref(pathname === "/" && hash ? `/${hash}` : pathname);
    };

    syncActiveHref();
    window.addEventListener("hashchange", syncActiveHref);
    return () => window.removeEventListener("hashchange", syncActiveHref);
  }, [pathname]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={[
          // Important: keep this *behind* the navbar content so backdrop-blur
          // blurs the page beneath the header (not the header text/buttons).
          "pointer-events-none absolute inset-0 -z-10",
          scrolled ? "bg-background/70 backdrop-blur-xl" : "bg-transparent",
        ].join(" ")}
      />

      <div className="container-padding relative">
        <div className="mx-auto max-w-6xl h-16 flex items-center justify-between">
          {/* Left: logo */}
          <Link
            href="/"
            className="pointer-events-auto flex items-center gap-3"
            onClick={() => setActiveHref("/")}
          >
            <div className="leading-tight">
              <div
                className="text-3xl font-bold text-slate-900 dark:text-white"
                style={{ fontFamily: "var(--font-dancing)" }}
              >
                Sambhunath Sahoo
              </div>
            </div>
          </Link>

          {/* Center: nav */}
          <nav className="pointer-events-auto hidden md:flex items-center gap-8">
            {NAV.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveHref(item.href)}
                  className={[
                    "relative text-sm font-semibold tracking-tight",
                    "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
                    "transition-colors duration-150 ease-out",
                    isActive ? "text-slate-900 dark:text-white" : "",
                  ].join(" ")}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-slate-900 dark:bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA + theme */}
          <div className="pointer-events-auto flex items-center gap-3">
            <Link
              href="/#contact"
              onClick={() => setActiveHref("/#contact")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors duration-200"
            >
              Let&apos;s Talk
            </Link>

            <ThemeIconButton theme={theme} toggleTheme={toggleTheme} />

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden h-10 w-10 rounded-full border border-border bg-muted
                         grid place-items-center text-muted-foreground hover:text-foreground
                         transition-colors"
              aria-label="Open menu"
            >
              <span className="text-lg leading-none">≡</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden container-padding">
          <div className="mx-auto max-w-6xl pb-4">
            <div className="rounded-2xl border border-border bg-background/85 backdrop-blur-xl shadow-sm overflow-hidden">
              <div className="p-2">
                {NAV.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      setActiveHref(item.href);
                      closeMobile();
                    }}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold
                               text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800
                               transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="p-3 border-t border-border flex items-center justify-between">
                <Link
                  href="/#contact"
                  onClick={() => {
                    setActiveHref("/#contact");
                    closeMobile();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors duration-200"
                >
                  Let&apos;s Talk
                </Link>
                <ThemeIconButton theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ThemeIconButton({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const [ticking, setTicking] = useState(false);
  const onClick = () => {
    setTicking(true);
    toggleTheme();
    window.setTimeout(() => setTicking(false), 220);
  };

  return (
    <button
      onClick={onClick}
      aria-label="Toggle theme"
      className="h-10 w-10 rounded-full border border-border bg-muted/70
                 grid place-items-center
                 hover:bg-muted transition-colors
                 relative overflow-hidden"
    >
      <span
        className="block transition-transform duration-200"
        style={{
          transform: ticking
            ? "scale(0.92) rotate(8deg)"
            : "scale(1) rotate(0deg)",
        }}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4 text-foreground" />
        ) : (
          <Moon className="h-4 w-4 text-foreground" />
        )}
      </span>
      <span
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
        style={{
          boxShadow: "0 0 24px -10px var(--accent)",
        }}
      />
    </button>
  );
}

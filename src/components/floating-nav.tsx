"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

const navItems = [
  { name: "About", href: "/about" },
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "Stack", href: "#stack" },
  { name: "Contact", href: "#contact" },
];

export function FloatingNav() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;
    const hash = window.location.hash;
    if (!hash || !hash.startsWith("#")) return;

    const sectionId = hash.slice(1);
    setActiveSection(sectionId);

    const el = document.querySelector(hash);
    if (!el) return;

    const offset = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }, [isHomePage, pathname]);

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection("about");
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      const sections = navItems
        .filter((item) => item.href.startsWith("#"))
        .map((item) => item.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, lastScrollY]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("/")) {
      if (href === "/about") setActiveSection("about");
      return;
    }
    
    e.preventDefault();

    if (href.startsWith("#")) setActiveSection(href.slice(1));
    
    if (!isHomePage) {
      router.push(`/${href}`);
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      const offset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.pushState(null, "", href);
    }
  };

  return (
    <nav
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
      }`}
    >
      <div
        className="flex items-center gap-1 px-1.5 py-1.5 rounded-full
                    bg-white/80 dark:bg-white/[0.08]
                    border border-black/[0.08] dark:border-white/[0.08]
                    shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.32)]
                    backdrop-blur-xl"
      >
        {/* Nav Items */}
        {navItems.map((item) => {
          const key =
            item.href.startsWith("#") ? item.href.slice(1) : "about";
          const isActive = activeSection === key;
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`
                relative px-4 py-2 text-[13px] font-medium rounded-full
                transition-all duration-200 ease-out
                ${
                  isActive
                    ? "text-foreground bg-black/[0.06] dark:bg-white/[0.12]"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <span className="relative z-10">{item.name}</span>
            </a>
          );
        })}

        {/* Divider */}
        <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

        {/* Theme Toggle */}
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      </div>
    </nav>
  );
}

function ThemeToggleButton({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) {
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative p-2 rounded-full
                 bg-black/[0.04] dark:bg-white/[0.08]
                 hover:bg-black/[0.08] dark:hover:bg-white/[0.15]
                 transition-all duration-200 ease-out
                 hover:scale-105 active:scale-95
                 group"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-foreground" />
      ) : (
        <Moon className="h-4 w-4 text-foreground" />
      )}
    </button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

  // Ensure hash navigation from other routes (e.g. /about -> /#work) actually
  // scrolls to the section on the home page.
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
    // If it's a page route (starts with /), let the browser handle it normally
    if (href.startsWith("/")) {
      if (href === "/about") setActiveSection("about");
      return; // Don't prevent default - allow normal navigation
    }
    
    e.preventDefault();

    if (href.startsWith("#")) setActiveSection(href.slice(1));
    
    // If we're not on the home page, navigate to home with the hash
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
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
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
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  {/* Active pill background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-black/[0.06] dark:bg-white/[0.12] rounded-full"
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </a>
              );
            })}

            {/* Divider */}
            <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

            {/* Theme Toggle */}
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function ThemeToggleButton({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Toggle theme"
      className="relative p-2 rounded-full
                 bg-black/[0.04] dark:bg-white/[0.08]
                 hover:bg-black/[0.08] dark:hover:bg-white/[0.15]
                 transition-all duration-200 ease-out
                 hover:scale-105 active:scale-95
                 group"
    >
      <motion.div
        animate={{
          rotate: isAnimating ? 180 : 0,
          scale: isAnimating ? 0.8 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-4 w-4 text-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-4 w-4 text-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}

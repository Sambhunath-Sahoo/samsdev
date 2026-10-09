"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = "portfolio-theme";
const THEME_TRANSITION_CLASS = "theme-transition";
const THEME_TRANSITION_MS = 200;

function readThemeFromDocument(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the class still applies.
  }
}

function withThemeTransition() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.documentElement;
  root.classList.add(THEME_TRANSITION_CLASS);
  window.setTimeout(() => root.classList.remove(THEME_TRANSITION_CLASS), THEME_TRANSITION_MS);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The inline script in layout.tsx sets the class before hydration;
  // we only mirror it into React state here.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(readThemeFromDocument());
  }, []);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    withThemeTransition();
    const next: Theme = readThemeFromDocument() === "dark" ? "light" : "dark";
    applyTheme(next);
    setThemeState(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

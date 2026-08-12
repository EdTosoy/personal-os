"use client";
import React, { useState, createContext, useCallback, useEffect } from "react";

type Theme = "dark" | "light";
type ContextProps = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ContextProps>({
  theme: "dark",
  toggleTheme: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  // Always start with the same value on server AND first client render
  // ("dark", matching the context default) so SSR markup and the first
  // hydration pass are byte-identical — no mismatch possible.
  const [theme, setTheme] = useState<Theme>("dark");

  // After mount (client-only, never runs during SSR/hydration), sync from
  // the DOM attribute the inline script in layout.tsx already set. This
  // just updates the toggle icon; it doesn't affect page colors, since
  // those are already driven by data-theme via CSS before paint.
  useEffect(() => {
    const domTheme = document.documentElement.getAttribute("data-theme");
    if (domTheme === "light" || domTheme === "dark") {
      setTheme(domTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      window.localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

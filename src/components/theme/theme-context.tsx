"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export type SiteTheme = "emerald" | "obsidian-crimson";

interface ThemeContextType {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => Promise<void>;
  isPending: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "emerald",
  setTheme: async () => {},
  isPending: false,
});

export function ThemeProvider({
  children,
  initialTheme = "emerald",
}: {
  children: React.ReactNode;
  initialTheme?: SiteTheme;
}) {
  const [theme, setThemeState] = useState<SiteTheme>(initialTheme);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Keep DOM in sync with current state
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const setTheme = async (newTheme: SiteTheme) => {
    // 1. Immediate optimistic update on client
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);

    // 2. Persist in cookie & localStorage for zero-lag local browsing
    try {
      localStorage.setItem("yuga_theme", newTheme);
      document.cookie = `yuga_theme=${newTheme};path=/;max-age=31536000;SameSite=Lax`;
    } catch {}

    // 3. Persist to server database via action
    startTransition(async () => {
      try {
        const { setSiteThemeAction } = await import("@/lib/actions/content");
        await setSiteThemeAction(newTheme);
        router.refresh();
      } catch (err) {
        console.error("Failed to update site theme on server:", err);
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isPending }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

function applyThemeToDOM(theme: SiteTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "obsidian-crimson") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

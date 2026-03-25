"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/contexts/theme-context";

export function DarkModeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 flex-shrink-0"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #fed7aa 0%, #fbbf24 100%)",
      }}
    >
      {/* Sun icon — visible in light mode */}
      <Sun
        className="absolute left-1.5 h-3.5 w-3.5 text-amber-600 transition-all duration-200"
        style={{ opacity: isDark ? 0 : 1, transform: isDark ? "scale(0.5)" : "scale(1)" }}
      />

      {/* Moon icon — visible in dark mode */}
      <Moon
        className="absolute right-1.5 h-3.5 w-3.5 text-blue-300 transition-all duration-200"
        style={{ opacity: isDark ? 1 : 0, transform: isDark ? "scale(1)" : "scale(0.5)" }}
      />

      {/* Thumb */}
      <span
        className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full shadow-md transition-transform duration-300"
        style={{
          background: isDark ? "#e2e8f0" : "#ffffff",
          transform: isDark ? "translateX(28px)" : "translateX(0)",
        }}
      />
    </button>
  );
}

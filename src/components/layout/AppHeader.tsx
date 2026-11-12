"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { IconMoon, IconSun } from "@/components/icons/NavIcons";

export function AppHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5"
      style={{
        background: "var(--header-bg)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full font-display text-lg italic"
          style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}
        >
          S
        </div>
        <div className="font-display text-lg tracking-wide" style={{ color: "var(--cream)" }}>
          El Sommelier <span style={{ color: "var(--gold)" }}>RD</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1.5 font-mono text-[0.55rem] tracking-widest sm:flex" style={{ color: "var(--text-dim)" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse-dot" />
          EN LINEA
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105"
          style={{ border: "1px solid var(--border)", background: "var(--glass-bg)" }}
        >
          {theme === "dark" ? <IconSun /> : <IconMoon />}
        </button>
      </div>
    </header>
  );
}

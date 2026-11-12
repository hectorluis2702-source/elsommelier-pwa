"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomTabBar } from "./BottomTabBar";

export function AppShell({ children }: { children: ReactNode }) {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setSplash(false), 1600);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      {splash && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700"
          style={{ background: "var(--bg)" }}
        >
          <div className="font-display text-6xl font-light tracking-widest animate-fade-in" style={{ color: "var(--gold)" }}>
            S
          </div>
          <div className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.35em] animate-fade-in" style={{ color: "var(--text-dim)" }}>
            El Sommelier RD
          </div>
          <div
            className="mt-10 h-px animate-expand"
            style={{
              background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }}
          />
        </div>
      )}

      {/* Full-bleed temple shell — wide on desktop, no phone-column cage */}
      <div
        className={`flex min-h-screen w-full flex-col transition-opacity duration-500 ${
          splash ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: "var(--bg)" }}
      >
        <AppHeader />
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-28 pt-5 animate-section-in sm:px-6 md:px-10 lg:px-14">
          {children}
        </main>
        <BottomTabBar />
      </div>
    </>
  );
}

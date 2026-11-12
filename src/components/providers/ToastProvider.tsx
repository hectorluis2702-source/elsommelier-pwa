"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastCtx = { showToast: (msg: string) => void };

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);

  const showToast = useCallback((m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(null), 2800);
  }, []);

  return (
    <Ctx.Provider value={{ showToast }}>
      {children}
      <div
        className={`fixed left-1/2 z-[200] max-w-[90vw] -translate-x-1/2 rounded-temple-sm px-4 py-2.5 font-mono text-[0.65rem] tracking-wide shadow-temple transition-all duration-300 ${
          msg
            ? "bottom-28 opacity-100"
            : "pointer-events-none bottom-20 opacity-0"
        }`}
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--cream)",
        }}
        role="status"
      >
        {msg}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

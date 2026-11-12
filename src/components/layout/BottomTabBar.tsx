"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconCamera,
  IconCellar,
  IconGraduation,
  IconHome,
  IconMap,
  IconMore,
  IconPlay,
  IconUser,
  IconUtensils,
  IconWine,
} from "@/components/icons/NavIcons";

const PRIMARY = [
  { href: "/", label: "Inicio", icon: IconHome },
  { href: "/maridaje", label: "Maridaje", icon: IconUtensils },
  { href: "/vinos", label: "Vinos", icon: IconWine },
  { href: "/videos", label: "Videos", icon: IconPlay },
] as const;

const MORE = [
  { href: "/mapa", label: "Mapa", icon: IconMap, desc: "Cartografia vinicola" },
  { href: "/bodega", label: "Bodega", icon: IconCellar, desc: "Tu coleccion" },
  { href: "/sommelier", label: "Sommelier", icon: IconGraduation, desc: "Consulta con AI" },
  { href: "/catalab", label: "Escanea", icon: IconCamera, desc: "Escanea etiquetas" },
  { href: "/academia", label: "Academia", icon: IconGraduation, desc: "15 lecciones" },
  { href: "/perfil", label: "Perfil", icon: IconUser, desc: "Tu progreso" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function BottomTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MORE.some((t) => isActive(pathname, t.href));

  return (
    <>
      {moreOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/45"
          aria-label="Cerrar menu"
          onClick={() => setMoreOpen(false)}
        />
      )}

      <div
        className={`fixed inset-x-0 bottom-[4.75rem] z-50 mx-auto max-w-lg px-3 transition-all duration-300 ${
          moreOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="glass-card overflow-hidden p-2">
          <p className="section-label px-3 pb-2 pt-2">Mas del templo</p>
          <div className="grid grid-cols-2 gap-1.5">
            {MORE.map(({ href, label, icon: Icon, desc }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2.5 rounded-temple-sm px-3 py-2.5 transition-colors"
                  style={{
                    background: active ? "var(--radial-glow)" : "transparent",
                    color: active ? "var(--gold)" : "var(--text)",
                  }}
                >
                  <Icon active={active} />
                  <span>
                    <span className="block font-mono text-[0.6rem] uppercase tracking-wider">{label}</span>
                    <span className="block text-[0.65rem]" style={{ color: "var(--text-dim)" }}>
                      {desc}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <nav
        className="glass-tabbar fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg"
        style={{ paddingBottom: "var(--safe-bottom)" }}
      >
        <div className="flex items-stretch justify-around px-1 pt-1.5 pb-1.5">
          {PRIMARY.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1 transition-colors"
                style={{ color: active ? "var(--gold)" : "var(--text-dim)" }}
              >
                <Icon active={active} />
                <span className="truncate font-mono text-[0.5rem] uppercase tracking-[0.1em]">{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1 transition-colors"
            style={{ color: moreOpen || moreActive ? "var(--gold)" : "var(--text-dim)" }}
            aria-expanded={moreOpen}
            aria-label="Mas opciones"
          >
            <IconMore active={moreOpen || moreActive} />
            <span className="truncate font-mono text-[0.5rem] uppercase tracking-[0.1em]">Mas</span>
          </button>
        </div>
      </nav>
    </>
  );
}

"use client";

import type { Vino } from "@/lib/api";
import { COLORES_VINO } from "@/lib/api";

export function WineBottleCard({
  vino,
  onClick,
}: {
  vino: Vino;
  onClick?: () => void;
}) {
  const tipo = (vino.tipo || "tintos").toLowerCase();
  const color = COLORES_VINO[tipo] || "#722F37";
  const rating = vino.rating?.promedio ? `${vino.rating.promedio}` : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-card flex w-full gap-3 overflow-hidden p-3 text-left transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div
        className="relative flex h-28 w-20 shrink-0 items-end justify-center overflow-hidden rounded-temple-sm"
        style={{
          background: `linear-gradient(180deg, ${color}33 0%, transparent 70%), var(--bg-elevated)`,
          border: "1px solid var(--border)",
        }}
      >
        {vino.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vino.imagen}
            alt={vino.nombre}
            className="absolute inset-0 h-full w-full object-contain p-1.5"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="flex h-full w-full flex-col items-center justify-end pb-2"
          style={{ display: vino.imagen ? "none" : "flex" }}
        >
          <div
            className="mb-1 h-16 w-5 rounded-t-full rounded-b-sm shadow-lg"
            style={{
              background: `linear-gradient(180deg, ${color} 0%, #1a0808 100%)`,
              boxShadow: `0 0 12px ${color}55`,
            }}
          />
          <div className="h-1.5 w-7 rounded-sm" style={{ background: "var(--gold)" }} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="font-display text-lg leading-tight" style={{ color: "var(--cream)" }}>
            {vino.nombre}
          </div>
          <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
            {[vino.bodega, vino.region || "Sin region"].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {vino.tipo ? (
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-wider"
              style={{ border: "1px solid var(--border)", color: "var(--gold)" }}
            >
              {vino.tipo}
            </span>
          ) : null}
          {rating ? (
            <span className="font-mono text-[0.65rem]" style={{ color: "var(--gold-light)" }}>
              {rating} ★
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

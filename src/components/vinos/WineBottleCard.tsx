"use client";

import type { Vino } from "@/lib/api";
import { wineFallback } from "@/lib/media";
import { resolveWineImage } from "@/lib/wineImages";

export function WineBottleCard({
  vino,
  onClick,
}: {
  vino: Vino;
  onClick?: () => void;
}) {
  const rating = vino.rating?.promedio ? `${vino.rating.promedio}` : null;
  const curated = resolveWineImage(vino.nombre, vino.imagen);
  const image = curated || wineFallback(vino.nombre || "vino");

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative min-h-[300px] w-full overflow-hidden rounded-temple text-left transition-transform duration-300 hover:scale-[1.02]"
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 18px 44px rgba(0,0,0,0.4)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={vino.nombre}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = wineFallback(vino.nombre || "fallback");
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 0 1px rgba(201,168,76,0.55)" }}
      />

      <div className="absolute inset-x-0 bottom-0 z-[2] p-3">
        <div className="rounded-temple-sm border border-white/10 bg-black/40 p-3 backdrop-blur-md">
          <div className="mb-1 flex items-center justify-between gap-2">
            {vino.tipo ? (
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-[var(--gold)]">
                {vino.tipo}
              </span>
            ) : (
              <span />
            )}
            {rating ? (
              <span className="font-mono text-[0.65rem] text-[var(--gold-light)]">{rating} ★</span>
            ) : null}
          </div>
          <div
            className="font-display text-2xl leading-tight text-[#f5efe0]"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}
          >
            {vino.nombre}
          </div>
          <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-wider text-[#c8bfa8]">
            {[vino.bodega, vino.region || "Sin region"].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>
    </button>
  );
}

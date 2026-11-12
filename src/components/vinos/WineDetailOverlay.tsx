"use client";

import { useEffect } from "react";
import type { Vino } from "@/lib/api";
import { COLORES_VINO, calcularPuntuacionRD } from "@/lib/api";
import { readBodega, toggleBodega } from "@/lib/bodega";
import { resolveWineImage } from "@/lib/wineImages";
import { wineFallback } from "@/lib/media";
import { useToast } from "@/components/providers/ToastProvider";
import { useState } from "react";

function RdBadge({ pts }: { pts: number }) {
  const fs = pts >= 100 ? "2.5rem" : "3rem";
  return (
    <div className="relative mx-auto h-28 w-28">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/badge-rd.jpg"
        alt="El Sommelier RD"
        className="h-full w-full rounded-full object-cover"
        style={{ border: "2px solid var(--gold)" }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center font-display font-semibold"
        style={{ color: "var(--cream)", fontSize: fs, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
      >
        {pts}
      </div>
    </div>
  );
}

export function WineDetailOverlay({
  vino,
  onClose,
}: {
  vino: Vino | null;
  onClose: () => void;
}) {
  const { showToast } = useToast();
  const [enBodega, setEnBodega] = useState(false);

  useEffect(() => {
    if (!vino) return;
    setEnBodega(readBodega().includes(vino.nombre));
    const onPop = () => onClose();
    history.pushState({ vinoOverlay: true }, "");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [vino, onClose]);

  if (!vino) return null;

  const tipo = (vino.tipo || "").toLowerCase();
  const color = COLORES_VINO[tipo] || "#722F37";
  const puntuacion = vino.rating?.promedio;
  const fuente = vino.rating?.fuente;
  const puntuacionRD =
    Math.min(100, vino.puntuacion_rd || calcularPuntuacionRD(puntuacion) || 0) || null;
  const chips = [
    vino.tipo ? vino.tipo.charAt(0).toUpperCase() + vino.tipo.slice(1) : null,
    vino.pais,
    vino.region,
    vino.denominacion_origen,
    vino.varietal,
  ].filter(Boolean) as string[];
  const maridajesArr = Array.isArray(vino.maridajes)
    ? vino.maridajes
    : vino.maridajes
      ? [vino.maridajes]
      : [];

  return (
    <div className="fixed inset-0 z-[90] flex flex-col" style={{ background: "var(--bg)" }}>
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--header-bg)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Volver"
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ border: "1px solid var(--border)", color: "var(--gold)" }}
        >
          ←
        </button>
        <div className="min-w-0">
          <div className="truncate font-display text-lg" style={{ color: "var(--cream)" }}>
            {vino.nombre || "Vino"}
          </div>
          <div className="truncate font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
            {[vino.bodega, vino.pais].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div
          className="relative flex h-48 items-center justify-center"
          style={{ background: `linear-gradient(135deg, #1a0a00, ${color}44)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveWineImage(vino.nombre, vino.imagen) || wineFallback(vino.nombre)}
            alt={vino.nombre}
            className="h-40 max-w-[70%] object-contain drop-shadow-2xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = wineFallback(vino.nombre);
            }}
          />
          {vino.tipo ? (
            <span
              className="absolute bottom-3 right-3 rounded-full px-3 py-1 font-mono text-[0.55rem] uppercase tracking-wider"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--border)", color: "var(--gold)" }}
            >
              {vino.tipo}
            </span>
          ) : null}
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h2 className="font-display text-2xl" style={{ color: "var(--text)" }}>
              {vino.nombre}
            </h2>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: "var(--burgundy)" }}>
              {vino.bodega || ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c}
                className="rounded-full px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-wider"
                style={{ border: "1px solid var(--border)", color: "var(--text-dim)" }}
              >
                {c}
              </span>
            ))}
          </div>

          {(puntuacionRD || puntuacion) && (
            <div>
              <div className="section-label mb-3">Puntuaciones</div>
              <div className="flex items-center justify-around gap-4">
                {puntuacionRD ? (
                  <div className="text-center">
                    <RdBadge pts={puntuacionRD} />
                    <div className="mt-2 font-mono text-[0.5rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                      Puntuación Oficial
                    </div>
                  </div>
                ) : null}
                {puntuacion ? (
                  <div className="text-center">
                    <div className="font-display text-4xl" style={{ color: "var(--gold)" }}>
                      {puntuacion}
                    </div>
                    <div className="font-mono text-[0.5rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                      {fuente || "Puntuación Internacional"}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-dim)" }}>
                      / 100 pts
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {vino.descripcion ? (
            <div>
              <div className="section-label mb-2">Descripción</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {vino.descripcion}
              </p>
            </div>
          ) : null}

          {vino.notas_cata ? (
            <div>
              <div className="section-label mb-2">Nota de Cata</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {vino.notas_cata}
              </p>
            </div>
          ) : null}

          {maridajesArr.length ? (
            <div>
              <div className="section-label mb-2">Maridajes</div>
              <div className="flex flex-wrap gap-2">
                {maridajesArr.map((m) => (
                  <span
                    key={m}
                    className="rounded-temple-sm px-2.5 py-1 text-xs"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--border)" }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {vino.precio_rango ? (
            <div>
              <div className="section-label mb-2">Precio estimado</div>
              <p className="font-display text-xl" style={{ color: "var(--cream)" }}>
                {vino.precio_rango}
              </p>
            </div>
          ) : null}

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              const now = toggleBodega(vino.nombre);
              setEnBodega(now);
              showToast(now ? "Agregado a tu bodega" : "Removido de tu bodega");
            }}
            style={
              enBodega
                ? { background: "transparent", color: "var(--gold)", borderColor: "var(--gold)" }
                : undefined
            }
          >
            {enBodega ? "✓ En tu bodega" : "+ Agregar a mi bodega"}
          </button>
        </div>
      </div>
    </div>
  );
}

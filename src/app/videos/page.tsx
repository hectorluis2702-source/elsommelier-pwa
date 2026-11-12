"use client";

import { useMemo, useState } from "react";
import { SectionHero } from "@/components/ui/SectionHero";
import { VIDEOS, VIDEO_CATEGORIAS, type VideoItem } from "@/lib/videos";

export default function VideosPage() {
  const [cat, setCat] = useState<VideoItem["categoria"] | "todos">("todos");
  const [playing, setPlaying] = useState<VideoItem | null>(null);

  const list = useMemo(
    () => (cat === "todos" ? VIDEOS : VIDEOS.filter((v) => v.categoria === cat)),
    [cat]
  );

  return (
    <div>
      <SectionHero
        greeting="Videoteca"
        title={
          <>
            El templo en <em>movimiento</em>
          </>
        }
        subtitle="Cata, maridaje, regiones y academia — la sabiduria de El Maestro en video."
      />

      <div className="mb-5 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {VIDEO_CATEGORIAS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className="shrink-0 rounded-full px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-wider"
            style={{
              border: `1px solid ${cat === c.id ? "var(--gold)" : "var(--border)"}`,
              color: cat === c.id ? "var(--gold)" : "var(--text-dim)",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {list.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setPlaying(v)}
            className="group overflow-hidden rounded-temple text-left transition-transform duration-300 hover:-translate-y-0.5"
            style={{
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
              animationDelay: `${i * 50}ms`,
            }}
          >
            <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${v.tone}`}>
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 40% 40%, rgba(201,168,76,0.25), transparent 55%)",
                }}
              />
              <div
                className="relative flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ border: "1px solid var(--gold)", background: "rgba(0,0,0,0.35)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)">
                  <path d="M9 7.5v9l8-4.5-8-4.5z" />
                </svg>
              </div>
              <span
                className="absolute bottom-3 right-3 rounded-full px-2 py-0.5 font-mono text-[0.55rem]"
                style={{ background: "rgba(0,0,0,0.55)", color: "#f5efe0" }}
              >
                {v.duracion}
              </span>
            </div>
            <div className="p-4" style={{ background: "var(--glass-bg)" }}>
              <div className="section-label mb-1">{v.categoria}</div>
              <h2 className="font-display text-xl leading-tight" style={{ color: "var(--text)" }}>
                {v.titulo}
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {v.descripcion}
              </p>
            </div>
          </button>
        ))}
      </div>

      {playing ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="glass-card w-full max-w-md overflow-hidden animate-section-in">
            <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${playing.tone}`}>
              <div className="text-center px-6">
                <div className="section-label mb-2">Proximamente</div>
                <p className="font-display text-xl text-[#f5efe0]">{playing.titulo}</p>
                <p className="mt-2 text-xs text-[#c8bfa8]">
                  El reproductor se conectara a la fuente oficial de videos.
                </p>
              </div>
            </div>
            <div className="flex justify-end p-3">
              <button
                type="button"
                className="rounded-temple-sm px-4 py-2 font-mono text-[0.6rem] uppercase tracking-wider"
                style={{ border: "1px solid var(--border)", color: "var(--gold)" }}
                onClick={() => setPlaying(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

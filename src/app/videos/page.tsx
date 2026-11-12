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
              border: `1px solid ${cat === c.id ? "var(--burgundy)" : "var(--border)"}`,
              color: cat === c.id ? "var(--burgundy)" : "var(--text-dim)",
              background: cat === c.id ? "var(--surface)" : "transparent",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="relative flex h-40 items-center justify-center overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div
                className="relative flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ border: "1px solid var(--gold)", background: "rgba(0,0,0,0.45)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#f5efe0">
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
            <div className="p-4" style={{ background: "var(--surface)" }}>
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
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          onClick={() => setPlaying(null)}
          role="presentation"
        >
          <div
            className="glass-card w-full max-w-4xl overflow-hidden animate-section-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={playing.titulo}
          >
            <div className="bg-black">
              <video
                key={playing.id}
                controls
                autoPlay
                playsInline
                poster={playing.poster}
                className="aspect-video w-full bg-black"
              >
                <source src={playing.src} type="video/mp4" />
              </video>
            </div>
            <div className="flex items-start justify-between gap-3 p-4" style={{ background: "var(--surface)" }}>
              <div>
                <div className="section-label mb-1">{playing.categoria}</div>
                <p className="font-display text-xl text-[var(--text)]">{playing.titulo}</p>
                <p className="mt-1 text-sm text-[var(--text-dim)]">{playing.descripcion}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-temple-sm px-4 py-2 font-mono text-[0.6rem] uppercase tracking-wider"
                style={{ border: "1px solid var(--burgundy)", color: "var(--burgundy)" }}
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

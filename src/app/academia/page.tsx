"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { type Leccion, listarLecciones, detalleLeccion } from "@/lib/api";
import { mdToHtml } from "@/lib/markdown";
import { academiaImage } from "@/lib/media";
import { useToast } from "@/components/providers/ToastProvider";

const NIVEL_LABEL: Record<string, string> = {
  bronce: "MODULO BRONCE — FUNDAMENTOS",
  plata: "MODULO PLATA — INTERMEDIO",
  oro: "MODULO ORO — AVANZADO",
  diplomado: "DIPLOMADO SOMMELIER PROFESIONAL",
};

const NIVEL_ORDEN: Record<string, number> = { bronce: 1, plata: 2, oro: 3, diplomado: 4 };

export default function AcademiaPage() {
  const { showToast } = useToast();
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [xp] = useState(320);
  const [overlay, setOverlay] = useState<{
    titulo: string;
    meta: string;
    body: ReactNode;
  } | null>(null);

  useEffect(() => {
    listarLecciones()
      .then((data) => {
        if (!data.success || !data.lecciones?.length) throw new Error("Sin lecciones");
        const sorted = [...data.lecciones].sort((a, b) => {
          const no = (NIVEL_ORDEN[a.nivel || ""] || 9) - (NIVEL_ORDEN[b.nivel || ""] || 9);
          if (no !== 0) return no;
          return (a.orden || 0) - (b.orden || 0);
        });
        setLecciones(sorted);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  async function abrir(l: Leccion) {
    const dur = l.duracion_estimada ? `${l.duracion_estimada} min` : "";
    setOverlay({
      titulo: l.titulo,
      meta: dur ? `${dur} de lectura` : "",
      body: (
        <div className="flex flex-col items-center gap-3 py-16 text-[#c8bfa8]">
          <div className="spinner" />
          <span className="text-base">Cargando leccion...</span>
        </div>
      ),
    });
    try {
      const data = await detalleLeccion(l.slug);
      if (!data.success || !data.leccion) throw new Error("No encontrada");
      setOverlay({
        titulo: l.titulo,
        meta: dur ? `${dur} de lectura` : "",
        body: renderDetalle(data.leccion, showToast, () => setOverlay(null)),
      });
    } catch {
      setOverlay({
        titulo: l.titulo,
        meta: "",
        body: (
          <div className="py-16 text-center text-base text-[#e8dfd0]">
            No se pudo cargar esta leccion. Intenta de nuevo.
          </div>
        ),
      });
    }
  }

  let nivelActual: string | null = null;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-[#2a0808]/40 blur-3xl" />

      <div className="relative pb-2 pt-1 text-center">
        <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--gold)]">
          Academia El Sommelier RD
        </div>
        <h1 className="font-display text-4xl font-light text-[#f5efe0]">
          Tu camino al <em className="text-[var(--gold)]">vino</em>
        </h1>
      </div>

      <div className="relative mb-4 mt-4 inline-flex rounded-full border border-[var(--gold)]/50 bg-[#1a1212] px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--gold)]">
        Nivel Bronce - Activo
      </div>

      <div className="relative mb-6 rounded-temple border border-[var(--border)] bg-[#161010] p-5">
        <div className="mb-2 flex justify-between font-mono text-[0.7rem] uppercase tracking-wider text-[#d4c8b0]">
          <span>Progreso</span>
          <span>
            {xp} / 1000 XP
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(xp / 1000) * 100}%`,
              background: "linear-gradient(90deg, var(--burgundy), var(--gold))",
            }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingState label="Cargando lecciones..." />
      ) : error ? (
        <p className="relative py-8 text-center text-base text-[#e8dfd0]">
          Error cargando lecciones. Verifica tu conexion.
        </p>
      ) : (
        <div className="relative space-y-3">
          {lecciones.map((l, i) => {
            const showHeader = l.nivel !== nivelActual;
            if (showHeader) nivelActual = l.nivel || null;
            const num = String(l.orden || i + 1).padStart(2, "0");
            const dur = l.duracion_estimada ? `${l.duracion_estimada} min` : "";
            const isDiplo = l.nivel === "diplomado";
            const thumb = l.imagen_url || academiaImage(i);
            return (
              <div key={l.slug}>
                {showHeader ? (
                  <div
                    className="mb-3 mt-3 font-mono text-[0.7rem] uppercase tracking-[0.14em]"
                    style={{ color: isDiplo ? "var(--gold-light)" : "var(--gold)" }}
                  >
                    {NIVEL_LABEL[l.nivel || ""] || (l.nivel || "").toUpperCase()}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => abrir(l)}
                  className="group flex w-full items-stretch overflow-hidden rounded-temple border text-left transition-transform duration-300 hover:scale-[1.01]"
                  style={{
                    borderColor: isDiplo ? "var(--gold)" : "rgba(201,168,76,0.28)",
                    background: "#1c1414",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
                  }}
                >
                  <div className="relative w-[88px] shrink-0 sm:w-[110px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4">
                    <span className="font-display text-2xl text-[var(--gold)] sm:text-3xl">{num}</span>
                    <span className="min-w-0 flex-1">
                      <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-wider text-[var(--gold)]">
                        {l.nivel || "Leccion"}
                      </span>
                      <span className="block font-display text-xl leading-snug text-[#f5efe0] sm:text-[1.35rem]">
                        {l.titulo}
                      </span>
                      {dur ? (
                        <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-wider text-[#d4c8b0]">
                          {dur}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-xl text-[var(--gold)]">›</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {overlay ? (
        <div className="fixed inset-0 z-[90] flex flex-col bg-[#0f0c0c]">
          <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[#161010] px-4 py-3.5">
            <button
              type="button"
              onClick={() => setOverlay(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--gold)]"
              aria-label="Volver"
            >
              ←
            </button>
            <div className="min-w-0">
              <div className="truncate font-display text-xl text-[#f5efe0]">{overlay.titulo}</div>
              <div className="font-mono text-[0.65rem] uppercase tracking-wider text-[#d4c8b0]">
                {overlay.meta}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-[#141010] p-5 sm:p-6">{overlay.body}</div>
        </div>
      ) : null}
    </div>
  );
}

function renderDetalle(
  l: Leccion,
  showToast: (m: string) => void,
  onClose: () => void
): ReactNode {
  let quizBlock: ReactNode = null;
  if (l.quiz) {
    const quiz = typeof l.quiz === "string" ? JSON.parse(l.quiz) : l.quiz;
    const preguntas = Array.isArray(quiz) ? quiz : (quiz as { preguntas?: unknown[] }).preguntas || [];
    if (preguntas.length) {
      quizBlock = (
        <div className="mt-8 space-y-4">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--gold)]">
            Quiz de repaso
          </div>
          {(
            preguntas as {
              pregunta: string;
              opciones?: string[];
              correcta?: number;
              respuesta_correcta?: number;
              explicacion?: string;
            }[]
          ).map((p, pi) => (
            <div
              key={pi}
              className="rounded-temple border border-[var(--border)] bg-[#1c1414] p-4"
            >
              <div className="mb-3 font-display text-lg text-[#f5efe0] sm:text-xl">
                {pi + 1}. {p.pregunta}
              </div>
              <div className="space-y-2">
                {(p.opciones || []).map((op, oi) => (
                  <button
                    key={oi}
                    type="button"
                    className="w-full rounded-temple-sm border border-[var(--border)] bg-[#221818] px-3.5 py-3 text-left text-base text-[#e8dfd0]"
                    onClick={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent?.querySelector("[data-answered]")) return;
                      e.currentTarget.setAttribute("data-answered", "1");
                      const ok = oi === (p.correcta ?? p.respuesta_correcta);
                      e.currentTarget.style.borderColor = ok ? "#2d8a4e" : "#c0392b";
                      e.currentTarget.style.background = ok
                        ? "rgba(45,138,78,0.15)"
                        : "rgba(192,57,43,0.12)";
                      if (p.explicacion) showToast(p.explicacion);
                    }}
                  >
                    {String.fromCharCode(65 + oi)}) {op}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  let ejemplos: ReactNode = null;
  if (l.ejemplos_practicos) {
    const ej =
      typeof l.ejemplos_practicos === "string"
        ? JSON.parse(l.ejemplos_practicos)
        : l.ejemplos_practicos;
    if (Array.isArray(ej) && ej.length) {
      ejemplos = (
        <div className="mt-8">
          <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--gold)]">
            Ejemplos practicos
          </div>
          {ej.map((e: { titulo?: string; descripcion?: string; detalle?: string }, i: number) => (
            <div
              key={i}
              className="mb-3 rounded-temple border border-[var(--border)] bg-[#1c1414] p-4"
            >
              <div className="font-display text-lg text-[#f5efe0]">
                {e.titulo || e.descripcion || JSON.stringify(e)}
              </div>
              {e.detalle ? (
                <p className="mt-2 text-base leading-relaxed text-[#e8dfd0]">{e.detalle}</p>
              ) : null}
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {l.imagen_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={l.imagen_url}
          alt={l.titulo}
          className="mb-5 w-full rounded-temple object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}

      {l.objetivos?.length ? (
        <div className="mb-6 rounded-temple border border-[var(--border)] bg-[#1c1414] p-5">
          <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--gold)]">
            Objetivos de aprendizaje
          </div>
          {l.objetivos.map((o) => (
            <div
              key={o}
              className="mb-2.5 border-l-2 border-[var(--gold)]/50 pl-3 text-base leading-relaxed text-[#e8dfd0]"
            >
              {o}
            </div>
          ))}
        </div>
      ) : null}

      {l.contenido_teorico ? (
        <div className="mb-6 rounded-temple border border-[var(--border)] bg-[#1c1414] p-5">
          <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--gold)]">
            Contenido
          </div>
          <div
            className="text-[1.08rem] leading-[1.7] text-[#e8dfd0]"
            dangerouslySetInnerHTML={{ __html: mdToHtml(l.contenido_teorico) }}
          />
        </div>
      ) : null}

      {ejemplos}
      {quizBlock}

      <button
        type="button"
        className="btn-primary mt-8 text-[0.75rem]"
        onClick={() => {
          showToast("¡Lección completada! +50 XP");
          setTimeout(onClose, 1200);
        }}
      >
        Marcar como completada
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { SectionHero } from "@/components/ui/SectionHero";
import { LoadingState } from "@/components/ui/LoadingState";
import { type Leccion, listarLecciones, detalleLeccion } from "@/lib/api";
import { mdToHtml } from "@/lib/markdown";
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
    body: React.ReactNode;
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
        <div className="flex flex-col items-center gap-3 py-16" style={{ color: "var(--text-dim)" }}>
          <div className="spinner" />
          <span>Cargando leccion...</span>
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
          <div className="py-16 text-center text-sm" style={{ color: "var(--text-dim)" }}>
            No se pudo cargar esta leccion. Intenta de nuevo.
          </div>
        ),
      });
    }
  }

  let nivelActual: string | null = null;

  return (
    <div>
      <SectionHero
        greeting="Academia El Sommelier RD"
        title={
          <>
            Tu camino al <em>vino</em>
          </>
        }
      />

      <div
        className="mb-4 inline-flex rounded-full px-3 py-1 font-mono text-[0.55rem] uppercase tracking-wider"
        style={{ border: "1px solid var(--border)", color: "var(--gold)" }}
      >
        Nivel Bronce - Activo
      </div>

      <div className="glass-card mb-6 p-4">
        <div className="mb-2 flex justify-between font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
          <span>Progreso</span>
          <span>
            {xp} / 1000 XP
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(xp / 1000) * 100}%`, background: "linear-gradient(90deg, var(--burgundy), var(--gold))" }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingState label="Cargando lecciones..." />
      ) : error ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-dim)" }}>
          Error cargando lecciones. Verifica tu conexion.
        </p>
      ) : (
        <div className="space-y-2">
          {lecciones.map((l, i) => {
            const showHeader = l.nivel !== nivelActual;
            if (showHeader) nivelActual = l.nivel || null;
            const num = String(l.orden || i + 1).padStart(2, "0");
            const dur = l.duracion_estimada ? `${l.duracion_estimada} min` : "";
            const isDiplo = l.nivel === "diplomado";
            return (
              <div key={l.slug}>
                {showHeader ? (
                  <div
                    className="mb-2 mt-5 font-mono text-[0.55rem] uppercase tracking-[0.14em]"
                    style={{ color: isDiplo ? "var(--gold-light)" : "var(--gold)" }}
                  >
                    {NIVEL_LABEL[l.nivel || ""] || (l.nivel || "").toUpperCase()}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => abrir(l)}
                  className="glass-card flex w-full items-center gap-3 p-3 text-left transition-transform hover:-translate-y-0.5"
                  style={isDiplo ? { borderColor: "var(--gold)" } : undefined}
                >
                  <span className="font-display text-2xl" style={{ color: "var(--gold)" }}>
                    {num}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg leading-tight" style={{ color: "var(--cream)" }}>
                      {l.titulo}
                    </span>
                    <span className="font-mono text-[0.5rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                      {dur}
                    </span>
                  </span>
                  <span style={{ color: "var(--text-dim)" }}>›</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {overlay ? (
        <div className="fixed inset-0 z-[90] flex flex-col" style={{ background: "var(--bg)" }}>
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--header-bg)" }}
          >
            <button
              type="button"
              onClick={() => setOverlay(null)}
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ border: "1px solid var(--border)", color: "var(--gold)" }}
              aria-label="Volver"
            >
              ←
            </button>
            <div className="min-w-0">
              <div className="truncate font-display text-lg" style={{ color: "var(--cream)" }}>
                {overlay.titulo}
              </div>
              <div className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                {overlay.meta}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{overlay.body}</div>
        </div>
      ) : null}
    </div>
  );
}

function renderDetalle(
  l: Leccion,
  showToast: (m: string) => void,
  onClose: () => void
): React.ReactNode {
  let quizBlock: React.ReactNode = null;
  if (l.quiz) {
    const quiz = typeof l.quiz === "string" ? JSON.parse(l.quiz) : l.quiz;
    const preguntas = Array.isArray(quiz) ? quiz : (quiz as { preguntas?: unknown[] }).preguntas || [];
    if (preguntas.length) {
      quizBlock = (
        <div className="mt-6 space-y-4">
          <div className="section-label">Quiz de repaso</div>
          {(preguntas as { pregunta: string; opciones?: string[]; correcta?: number; respuesta_correcta?: number; explicacion?: string }[]).map(
            (p, pi) => (
              <div key={pi} className="glass-card p-3">
                <div className="mb-2 font-display text-base">
                  {pi + 1}. {p.pregunta}
                </div>
                <div className="space-y-1.5">
                  {(p.opciones || []).map((op, oi) => (
                    <button
                      key={oi}
                      type="button"
                      className="w-full rounded-temple-sm px-3 py-2 text-left text-sm"
                      style={{ border: "1px solid var(--border)", background: "var(--glass-bg)" }}
                      onClick={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent?.querySelector("[data-answered]")) return;
                        e.currentTarget.setAttribute("data-answered", "1");
                        const ok = oi === (p.correcta ?? p.respuesta_correcta);
                        e.currentTarget.style.borderColor = ok ? "#2d8a4e" : "#c0392b";
                        if (p.explicacion) showToast(p.explicacion);
                      }}
                    >
                      {String.fromCharCode(65 + oi)}) {op}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      );
    }
  }

  let ejemplos: React.ReactNode = null;
  if (l.ejemplos_practicos) {
    const ej =
      typeof l.ejemplos_practicos === "string"
        ? JSON.parse(l.ejemplos_practicos)
        : l.ejemplos_practicos;
    if (Array.isArray(ej) && ej.length) {
      ejemplos = (
        <div className="mt-6">
          <div className="section-label mb-2">Ejemplos practicos</div>
          {ej.map((e: { titulo?: string; descripcion?: string; detalle?: string }, i: number) => (
            <div key={i} className="glass-card mb-2 p-3">
              <div className="font-display">{e.titulo || e.descripcion || JSON.stringify(e)}</div>
              {e.detalle ? (
                <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
                  {e.detalle}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div>
      {l.imagen_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={l.imagen_url}
          alt={l.titulo}
          className="mb-4 w-full rounded-temple object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}
      {l.objetivos?.length ? (
        <div className="mb-4">
          <div className="section-label mb-2">Objetivos de aprendizaje</div>
          {l.objetivos.map((o) => (
            <div
              key={o}
              className="mb-2 border-l pl-3 text-sm"
              style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
            >
              {o}
            </div>
          ))}
        </div>
      ) : null}
      {l.contenido_teorico ? (
        <div className="mb-4">
          <div className="section-label mb-2">Contenido</div>
          <div
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-dim)" }}
            dangerouslySetInnerHTML={{ __html: mdToHtml(l.contenido_teorico) }}
          />
        </div>
      ) : null}
      {ejemplos}
      {quizBlock}
      <button
        type="button"
        className="btn-primary mt-6"
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

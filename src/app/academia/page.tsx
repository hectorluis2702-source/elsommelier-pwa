"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { type Leccion, listarLecciones, detalleLeccion } from "@/lib/api";
import { mdToHtml } from "@/lib/markdown";
import { useToast } from "@/components/providers/ToastProvider";

const PLAN_KEY = "elsommelier-plan";
const ACADEMIA_OPEN_KEY = "elsommelier-academia-open";

type PlanId = "bronce" | "plata" | "oro";
type ModuloId = "bronce" | "plata" | "oro" | "diplomado";

const NIVEL_LABEL: Record<ModuloId, string> = {
  bronce: "Modulo Bronce — Fundamentos",
  plata: "Modulo Plata — Intermedio",
  oro: "Modulo Oro — Avanzado",
  diplomado: "Diplomado Sommelier Profesional",
};

const NIVEL_ORDEN: Record<string, number> = { bronce: 1, plata: 2, oro: 3, diplomado: 4 };

const PLAN_ACCESS: Record<PlanId, ModuloId[]> = {
  bronce: ["bronce"],
  plata: ["bronce", "plata"],
  oro: ["bronce", "plata", "oro", "diplomado"],
};

type View = "modulos" | "indice" | "leccion";

export default function AcademiaPage() {
  const { showToast } = useToast();
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [plan, setPlan] = useState<PlanId>("bronce");
  const [view, setView] = useState<View>("modulos");
  const [moduloActivo, setModuloActivo] = useState<ModuloId | null>(null);
  const [indiceAbierto, setIndiceAbierto] = useState(true);
  const [leccionActiva, setLeccionActiva] = useState<Leccion | null>(null);
  const [detalle, setDetalle] = useState<Leccion | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [xp] = useState(320);

  useEffect(() => {
    const stored = localStorage.getItem(PLAN_KEY) as PlanId | null;
    if (stored === "bronce" || stored === "plata" || stored === "oro") {
      setPlan(stored);
    }

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

  // Desde Perfil: plan elegido → abrir índice del módulo correspondiente
  useEffect(() => {
    if (loading || error || lecciones.length === 0) return;

    const raw = sessionStorage.getItem(ACADEMIA_OPEN_KEY);
    if (!raw) return;
    sessionStorage.removeItem(ACADEMIA_OPEN_KEY);

    const target: ModuloId =
      raw === "plata" || raw === "oro" || raw === "bronce" || raw === "diplomado"
        ? raw
        : "bronce";

    const allowed = PLAN_ACCESS[plan];
    if (!allowed.includes(target) && target !== "bronce") {
      showToast(`Tu plan ${plan} no incluye este módulo.`);
      return;
    }

    setModuloActivo(target);
    setIndiceAbierto(true);
    setView("indice");
    setLeccionActiva(null);
    setDetalle(null);
    showToast(`${NIVEL_LABEL[target]} listo`);
  }, [loading, error, lecciones, plan, showToast]);

  const modulosDisponibles = useMemo(() => {
    const allowed = PLAN_ACCESS[plan];
    const present = new Set(
      lecciones.map((l) => (l.nivel || "bronce").toLowerCase() as ModuloId)
    );
    return (["bronce", "plata", "oro", "diplomado"] as ModuloId[]).filter(
      (m) => present.has(m) || allowed.includes(m)
    );
  }, [lecciones, plan]);

  const leccionesDelModulo = useMemo(() => {
    if (!moduloActivo) return [];
    return lecciones.filter((l) => (l.nivel || "bronce").toLowerCase() === moduloActivo);
  }, [lecciones, moduloActivo]);

  function abrirModulo(id: ModuloId) {
    const allowed = PLAN_ACCESS[plan];
    if (!allowed.includes(id) && id !== "bronce") {
      showToast(`Tu plan ${plan} no incluye este modulo. Actualiza en Perfil.`);
      return;
    }
    setModuloActivo(id);
    setIndiceAbierto(true);
    setView("indice");
    setLeccionActiva(null);
    setDetalle(null);
  }

  async function abrirLeccion(l: Leccion) {
    setLeccionActiva(l);
    setView("leccion");
    setCargandoDetalle(true);
    setDetalle(null);
    try {
      const data = await detalleLeccion(l.slug);
      if (!data.success || !data.leccion) throw new Error("No encontrada");
      setDetalle(data.leccion);
    } catch {
      showToast("No se pudo cargar esta leccion");
      setView("indice");
      setLeccionActiva(null);
    } finally {
      setCargandoDetalle(false);
    }
  }

  function regresarAlIndice() {
    setView("indice");
    setLeccionActiva(null);
    setDetalle(null);
    setIndiceAbierto(true);
  }

  function regresarAModulos() {
    setView("modulos");
    setModuloActivo(null);
    setLeccionActiva(null);
    setDetalle(null);
  }

  if (loading) {
    return <LoadingState label="Cargando academia..." />;
  }

  if (error) {
    return (
      <p className="py-10 text-center text-base text-[var(--text)]">
        Error cargando lecciones. Verifica tu conexion.
      </p>
    );
  }

  // ─── VISOR DE LECCIÓN ───
  if (view === "leccion" && leccionActiva) {
    const num =
      leccionActiva.orden ||
      leccionesDelModulo.findIndex((x) => x.slug === leccionActiva.slug) + 1 ||
      1;
    const idx = leccionesDelModulo.findIndex((x) => x.slug === leccionActiva.slug);
    const prev = idx > 0 ? leccionesDelModulo[idx - 1] : null;
    const next = idx >= 0 && idx < leccionesDelModulo.length - 1 ? leccionesDelModulo[idx + 1] : null;

    return (
      <div className="relative -mx-4 -mt-5 min-h-[80vh] bg-[var(--bg)] pb-8">
        <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface-2)]/95 px-4 py-3 backdrop-blur-md">
          <button
            type="button"
            onClick={regresarAlIndice}
            className="mb-2 inline-flex items-center gap-2 rounded-temple-sm border border-[var(--gold)]/50 px-3 py-2 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--gold)]"
          >
            ← Regresar al índice
          </button>
          <div className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--gold)]">
            Lección {num}
            {leccionActiva.duracion_estimada
              ? ` · ${leccionActiva.duracion_estimada} min`
              : ""}
          </div>
          <h1 className="mt-1 font-display text-2xl leading-snug text-[var(--text)] sm:text-3xl">
            {leccionActiva.titulo}
          </h1>
        </div>

        <div className="px-4 py-6 sm:px-6">
          {cargandoDetalle ? (
            <LoadingState label="Cargando contenido..." />
          ) : detalle ? (
            <LeccionReader
              leccion={detalle}
              onComplete={() => {
                showToast("¡Lección completada! +50 XP");
                setTimeout(regresarAlIndice, 900);
              }}
              showToast={showToast}
            />
          ) : null}

          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={regresarAlIndice}
              className="flex-1 rounded-temple border border-[var(--gold)] py-3.5 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--gold)]"
            >
              Regresar al índice
            </button>
            {prev ? (
              <button
                type="button"
                onClick={() => abrirLeccion(prev)}
                className="flex-1 rounded-temple border border-[var(--border)] bg-[var(--surface)] py-3.5 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--text-dim)]"
              >
                ← Anterior
              </button>
            ) : null}
            {next ? (
              <button
                type="button"
                onClick={() => abrirLeccion(next)}
                className="flex-1 rounded-temple border border-[var(--border)] bg-[var(--surface)] py-3.5 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--text-dim)]"
              >
                Siguiente →
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // ─── ÍNDICE DEL MÓDULO ───
  if (view === "indice" && moduloActivo) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={regresarAModulos}
          className="mb-4 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--gold)]"
        >
          ← Todos los módulos
        </button>

        <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--gold)]">
          Plan {plan} · Índice
        </div>
        <h1 className="font-display text-3xl text-[var(--text)] sm:text-4xl">
          {NIVEL_LABEL[moduloActivo]}
        </h1>
        <p className="mt-2 text-base text-[var(--text-dim)]">
          {leccionesDelModulo.length}{" "}
          {leccionesDelModulo.length === 1 ? "lección" : "lecciones"} en este módulo
        </p>

        <div className="mt-6 overflow-hidden rounded-temple border border-[var(--border)] bg-[var(--surface)]">
          <button
            type="button"
            onClick={() => setIndiceAbierto((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-4 text-left"
            aria-expanded={indiceAbierto}
          >
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-[var(--gold)]">
              Índice de lecciones
            </span>
            <span className="text-[var(--gold)]">{indiceAbierto ? "▴" : "▾"}</span>
          </button>

          {indiceAbierto ? (
            <div className="border-t border-[var(--border)]">
              {leccionesDelModulo.length === 0 ? (
                <p className="px-4 py-6 text-base text-[var(--text-dim)]">
                  Aun no hay lecciones publicadas en este modulo.
                </p>
              ) : (
                leccionesDelModulo.map((l, i) => {
                  const num = l.orden || i + 1;
                  const dur = l.duracion_estimada ? `${l.duracion_estimada} min` : "";
                  return (
                    <button
                      key={l.slug}
                      type="button"
                      onClick={() => abrirLeccion(l)}
                      className="flex w-full items-start gap-3 border-b border-[var(--border)]/70 px-4 py-4 text-left last:border-b-0 transition-colors hover:bg-[var(--surface-2)]"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/50 font-mono text-[0.7rem] text-[var(--gold)]">
                        {num}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[0.6rem] uppercase tracking-wider text-[var(--gold)]">
                          Lección {num}
                          {dur ? ` · ${dur}` : ""}
                        </span>
                        <span className="mt-1 block font-display text-xl leading-snug text-[var(--text)]">
                          {l.titulo}
                        </span>
                      </span>
                      <span className="mt-1 text-[var(--gold)]">›</span>
                    </button>
                  );
                })
              )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // ─── LISTA DE MÓDULOS ───
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-[#2a0808]/40 blur-3xl" />

      <div className="relative pb-2 pt-1 text-center">
        <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--gold)]">
          Academia El Sommelier RD
        </div>
        <h1 className="font-display text-4xl font-light text-[var(--text)]">
          Tu camino al <em className="text-[var(--burgundy)]">vino</em>
        </h1>
      </div>

      <div className="relative mb-4 mt-4 inline-flex rounded-full border border-[var(--gold)]/50 bg-[var(--surface-2)] px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--gold)]">
        Plan {plan.charAt(0).toUpperCase() + plan.slice(1)} - Activo
      </div>

      <div className="relative mb-6 rounded-temple border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <div className="mb-2 flex justify-between font-mono text-[0.7rem] uppercase tracking-wider text-[var(--text-dim)]">
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

      <p className="relative mb-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--gold)]">
        Selecciona un módulo
      </p>

      <div className="relative space-y-3">
        {modulosDisponibles.map((m) => {
          const count = lecciones.filter((l) => (l.nivel || "").toLowerCase() === m).length;
          const locked = !PLAN_ACCESS[plan].includes(m);
          return (
            <button
              key={m}
              type="button"
              onClick={() => abrirModulo(m)}
              className="flex w-full items-center justify-between rounded-temple border px-4 py-5 text-left transition-transform duration-300 hover:scale-[1.01]"
              style={{
                borderColor: locked ? "var(--border)" : "var(--burgundy)",
                background: locked ? "var(--surface-2)" : "var(--surface)",
              }}
            >
              <span>
                <span
                  className="block font-display text-2xl"
                  style={{ color: locked ? "var(--text-dim)" : "var(--text)" }}
                >
                  {NIVEL_LABEL[m]}
                </span>
                <span
                  className="mt-1 block font-mono text-[0.65rem] uppercase tracking-wider"
                  style={{ color: locked ? "var(--burgundy)" : "var(--text-dim)" }}
                >
                  {locked
                    ? "Bloqueado — actualiza tu plan"
                    : `${count} ${count === 1 ? "lección" : "lecciones"} · Ver índice`}
                </span>
              </span>
              <span className="font-mono text-sm" style={{ color: "var(--burgundy)" }}>
                {locked ? "Bloq." : "›"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LeccionReader({
  leccion,
  onComplete,
  showToast,
}: {
  leccion: Leccion;
  onComplete: () => void;
  showToast: (m: string) => void;
}) {
  let quizBlock: ReactNode = null;
  if (leccion.quiz) {
    const quiz = typeof leccion.quiz === "string" ? JSON.parse(leccion.quiz) : leccion.quiz;
    const preguntas = Array.isArray(quiz)
      ? quiz
      : (quiz as { preguntas?: unknown[] }).preguntas || [];
    if (preguntas.length) {
      quizBlock = (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl text-[var(--text)]">Quiz de repaso</h2>
          <div className="space-y-4">
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
                className="rounded-temple border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="mb-3 font-display text-xl text-[var(--text)]">
                  {pi + 1}. {p.pregunta}
                </div>
                <div className="space-y-2">
                  {(p.opciones || []).map((op, oi) => (
                    <button
                      key={oi}
                      type="button"
                      className="w-full rounded-temple-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-left text-[1.05rem] leading-relaxed text-[var(--text)]"
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
        </section>
      );
    }
  }

  let ejemplos: ReactNode = null;
  if (leccion.ejemplos_practicos) {
    const ej =
      typeof leccion.ejemplos_practicos === "string"
        ? JSON.parse(leccion.ejemplos_practicos)
        : leccion.ejemplos_practicos;
    if (Array.isArray(ej) && ej.length) {
      ejemplos = (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl text-[var(--text)]">Ejemplos practicos</h2>
          {ej.map((e: { titulo?: string; descripcion?: string; detalle?: string }, i: number) => (
            <div
              key={i}
              className="mb-3 rounded-temple border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="font-display text-xl text-[var(--text)]">
                {e.titulo || e.descripcion || JSON.stringify(e)}
              </div>
              {e.detalle ? (
                <p className="mt-2 text-[1.08rem] leading-[1.7] text-[var(--text)]">{e.detalle}</p>
              ) : null}
            </div>
          ))}
        </section>
      );
    }
  }

  return (
    <article className="mx-auto max-w-2xl">
      {leccion.imagen_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={leccion.imagen_url}
          alt={leccion.titulo}
          className="mb-6 w-full rounded-temple object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}

      {leccion.objetivos?.length ? (
        <section className="mb-8 rounded-temple border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="mb-4 font-display text-2xl text-[var(--text)]">Objetivos de aprendizaje</h2>
          {leccion.objetivos.map((o) => (
            <div
              key={o}
              className="mb-3 border-l-2 border-[var(--gold)]/55 pl-3.5 text-[1.08rem] leading-[1.65] text-[var(--text)]"
            >
              {o}
            </div>
          ))}
        </section>
      ) : null}

      {leccion.contenido_teorico ? (
        <section className="mb-8 rounded-temple border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
          <h2 className="mb-5 font-display text-2xl text-[var(--text)]">Contenido</h2>
          <div
            className="text-[1.15rem] leading-[1.8] text-[#efe6d6] sm:text-[1.2rem]"
            dangerouslySetInnerHTML={{ __html: mdToHtml(leccion.contenido_teorico) }}
          />
        </section>
      ) : (
        <p className="rounded-temple border border-[var(--border)] bg-[var(--surface)] p-5 text-base text-[var(--text-dim)]">
          Esta leccion aun no tiene contenido teorico publicado.
        </p>
      )}

      {ejemplos}
      {quizBlock}

      <button type="button" className="btn-primary mt-10 text-[0.75rem]" onClick={onComplete}>
        Marcar como completada
      </button>
    </article>
  );
}

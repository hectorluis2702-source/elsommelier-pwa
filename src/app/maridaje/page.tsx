"use client";

import { useRef, useState, type ReactNode } from "react";
import { HeroMediaCard } from "@/components/ui/HeroMediaCard";
import { PLATOS_TRADICIONALES, PRESUPUESTOS } from "@/lib/platos";
import { maridajeParaPlato } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";

type MaridajeItem = {
  vino?: string;
  nombre?: string;
  region?: string;
  varietal?: string;
  tipo?: string;
  razon?: string;
  explicacion?: string;
  descripcion?: string;
  nota_poetica?: string;
};

export default function MaridajePage() {
  const { showToast } = useToast();
  const [platoId, setPlatoId] = useState<string | null>(null);
  const [platoLibre, setPlatoLibre] = useState("");
  const [presupuesto, setPresupuesto] = useState("cualquiera");
  const [loading, setLoading] = useState(false);
  const [resultHtml, setResultHtml] = useState<ReactNode>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function buscarConNombre(nombre: string) {
    if (!nombre.trim()) {
      showToast("Selecciona o escribe un plato");
      return;
    }
    setLoading(true);
    setResultHtml(
      <div className="flex flex-col items-center gap-3 py-8" style={{ color: "var(--text-dim)" }}>
        <div className="spinner" />
        <span className="font-mono text-[0.65rem]">El Maestro esta eligiendo...</span>
      </div>
    );
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    try {
      const data = await maridajeParaPlato(nombre.trim());
      void presupuesto;

      if (data.respuesta_libre) {
        setResultHtml(
          <div className="rounded-temple border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="mb-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--burgundy)]">
              El Sommelier dice
            </div>
            <p className="text-base leading-relaxed text-[var(--text)]">{String(data.respuesta_libre)}</p>
          </div>
        );
        return;
      }

      const vinos = (data.maridajes || data.vinos || data.recomendaciones || []) as MaridajeItem[];
      if (!vinos.length) {
        setResultHtml(
          <div className="rounded-temple border border-[var(--border)] bg-[var(--surface)] p-4 text-base text-[var(--text-dim)]">
            No se encontraron maridajes para {nombre}
          </div>
        );
        return;
      }

      setResultHtml(
        <div className="space-y-3">
          <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--burgundy)]">
            Maridajes para {nombre}
          </div>
          {vinos.map((v, i) => {
            const vinoNombre = v.vino || v.nombre || "";
            const region = v.region || "";
            const varietal = v.varietal || v.tipo || "";
            const razon = v.razon || v.explicacion || v.descripcion || "";
            const poetica = v.nota_poetica || "";
            return (
              <div
                key={`${vinoNombre}-${i}`}
                className="rounded-temple border border-[var(--border)] bg-[var(--surface)] p-4 transition-transform duration-300 hover:scale-[1.01]"
              >
                <div className="font-display text-2xl text-[var(--text)]">{vinoNombre}</div>
                <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-wider text-[var(--burgundy)]">
                  {varietal} - {region}
                </div>
                {razon ? (
                  <p className="mt-3 text-base leading-relaxed text-[var(--text-dim)]">{razon}</p>
                ) : null}
                {poetica ? (
                  <p className="mt-2 font-display text-base italic text-[var(--burgundy)]">{poetica}</p>
                ) : null}
              </div>
            );
          })}
          {data.consejo_maestro || data.consejo ? (
            <div className="rounded-temple border border-[var(--burgundy)]/35 bg-[var(--surface-2)] p-4">
              <div className="mb-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--burgundy)]">
                Consejo del Sommelier
              </div>
              <p className="text-base leading-relaxed text-[var(--text)]">
                {String(data.consejo_maestro || data.consejo)}
              </p>
            </div>
          ) : null}
        </div>
      );
    } catch {
      setResultHtml(
        <div className="text-base text-[var(--text-dim)]">
          No se pudo conectar con el motor de maridaje. Verifica la conexion.
        </div>
      );
    } finally {
      setLoading(false);
    }
  }

  function onPlatoClick(id: string, nombre: string) {
    setPlatoId(id);
    setPlatoLibre("");
    void buscarConNombre(nombre);
  }

  return (
    <div className="relative">
      <div className="relative pb-2 pt-1 text-center">
        <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--burgundy)]">
          Motor de maridaje
        </div>
        <h1 className="font-display text-4xl font-light leading-tight text-[var(--text)]">
          Cocina <em className="text-[var(--burgundy)]">dominicana</em>
          <br />+ vino mundial
        </h1>
      </div>

      <div className="relative mb-3 mt-6 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--burgundy)]">
        Platos tradicionales — toca para maridar
      </div>
      <div className="relative mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATOS_TRADICIONALES.map((p) => (
          <HeroMediaCard
            key={p.id}
            image={p.image}
            title={p.nombre}
            subtitle={loading && platoId === p.id ? "Buscando vino..." : p.desc}
            badge="Gastronomia RD"
            active={platoId === p.id && !platoLibre.trim()}
            tall
            onClick={() => onPlatoClick(p.id, p.nombre)}
          />
        ))}
      </div>

      <label className="relative mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--burgundy)]">
        O escribe tu plato
      </label>
      <input
        className="input-temple relative mb-4"
        value={platoLibre}
        onChange={(e) => setPlatoLibre(e.target.value)}
        placeholder="Ej: Pernil de cerdo asado..."
      />

      <label className="relative mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--burgundy)]">
        Presupuesto
      </label>
      <select
        className="input-temple relative mb-5"
        value={presupuesto}
        onChange={(e) => setPresupuesto(e.target.value)}
      >
        {PRESUPUESTOS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn-primary relative mb-6"
        onClick={() => {
          const nombre =
            platoLibre.trim() ||
            PLATOS_TRADICIONALES.find((p) => p.id === platoId)?.nombre ||
            "";
          void buscarConNombre(nombre);
        }}
        disabled={loading}
      >
        {loading ? "Consultando al Maestro..." : "Descubrir Maridaje"}
      </button>

      <div className="relative" ref={resultRef}>
        {resultHtml}
      </div>
    </div>
  );
}

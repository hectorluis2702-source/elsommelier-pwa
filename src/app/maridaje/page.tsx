"use client";

import { useState, type ReactNode } from "react";
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

  const selectedNombre =
    platoLibre.trim() ||
    PLATOS_TRADICIONALES.find((p) => p.id === platoId)?.nombre ||
    "";

  async function buscar() {
    if (!selectedNombre) {
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
    try {
      const data = await maridajeParaPlato(selectedNombre);
      void presupuesto;

      if (data.respuesta_libre) {
        setResultHtml(
          <div className="rounded-temple border border-white/10 bg-black/40 p-4 backdrop-blur-md">
            <div className="mb-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--gold)]">
              El Sommelier dice
            </div>
            <p className="text-sm leading-relaxed text-[#e8dfd0]">{String(data.respuesta_libre)}</p>
          </div>
        );
        return;
      }

      const vinos = (data.maridajes || data.vinos || data.recomendaciones || []) as MaridajeItem[];
      if (!vinos.length) {
        setResultHtml(
          <div className="rounded-temple border border-white/10 bg-black/40 p-4 text-sm text-[#c8bfa8] backdrop-blur-md">
            No se encontraron maridajes para {selectedNombre}
          </div>
        );
        return;
      }

      setResultHtml(
        <div className="space-y-3">
          <div className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--gold)]">
            Maridajes para {selectedNombre}
          </div>
          {vinos.map((v, i) => {
            const nombre = v.vino || v.nombre || "";
            const region = v.region || "";
            const varietal = v.varietal || v.tipo || "";
            const razon = v.razon || v.explicacion || v.descripcion || "";
            const poetica = v.nota_poetica || "";
            return (
              <div
                key={`${nombre}-${i}`}
                className="rounded-temple border border-white/10 bg-black/40 p-4 backdrop-blur-md transition-transform duration-300 hover:scale-[1.02]"
                style={{ boxShadow: "0 12px 36px rgba(0,0,0,0.35)" }}
              >
                <div className="font-display text-2xl text-[#f5efe0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  {nombre}
                </div>
                <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-wider text-[var(--gold)]">
                  {varietal} - {region}
                </div>
                {razon ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#c8bfa8]">{razon}</p>
                ) : null}
                {poetica ? (
                  <p className="mt-2 font-display text-sm italic text-[var(--gold-light)]">{poetica}</p>
                ) : null}
              </div>
            );
          })}
          {data.consejo_maestro || data.consejo ? (
            <div className="rounded-temple border border-[var(--gold)]/40 bg-gradient-to-br from-[#2a0808]/80 to-black/50 p-4 backdrop-blur-md">
              <div className="mb-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--gold)]">
                Consejo del Sommelier
              </div>
              <p className="text-sm leading-relaxed text-[#e8dfd0]">
                {String(data.consejo_maestro || data.consejo)}
              </p>
            </div>
          ) : null}
        </div>
      );
    } catch {
      setResultHtml(
        <div className="text-sm text-[#c8bfa8]">
          No se pudo conectar con el motor de maridaje. Verifica la conexion.
        </div>
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-[#2a0808]/55 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-40 h-56 w-56 rounded-full bg-[#800020]/20 blur-3xl" />

      <div className="relative pb-2 pt-1 text-center">
        <div className="mb-2 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[var(--gold)]">
          Motor de maridaje
        </div>
        <h1 className="font-display text-4xl font-light leading-tight text-[#f5efe0] drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
          Cocina <em className="text-[var(--gold)]">dominicana</em>
          <br />+ vino mundial
        </h1>
      </div>

      <div className="relative mb-3 mt-6 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--gold)]">
        Platos tradicionales
      </div>
      <div className="relative mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLATOS_TRADICIONALES.map((p) => (
          <HeroMediaCard
            key={p.id}
            image={p.image}
            title={p.nombre}
            subtitle={p.desc}
            badge="Gastronomia RD"
            active={platoId === p.id && !platoLibre.trim()}
            tall
            onClick={() => {
              setPlatoId(p.id);
              setPlatoLibre("");
            }}
          />
        ))}
      </div>

      <label className="relative mb-2 block font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--gold)]">
        O escribe tu plato
      </label>
      <input
        className="input-temple relative mb-4"
        value={platoLibre}
        onChange={(e) => setPlatoLibre(e.target.value)}
        placeholder="Ej: Pernil de cerdo asado..."
      />

      <label className="relative mb-2 block font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--gold)]">
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

      <button type="button" className="btn-primary relative mb-6" onClick={buscar} disabled={loading}>
        {loading ? "Consultando al Maestro..." : "Descubrir Maridaje"}
      </button>

      <div className="relative">{resultHtml}</div>
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { SectionHero } from "@/components/ui/SectionHero";
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
          <div className="glass-card p-4">
            <div className="section-label mb-2">El Sommelier dice</div>
            <p className="text-sm leading-relaxed">{String(data.respuesta_libre)}</p>
          </div>
        );
        return;
      }

      const vinos = (data.maridajes || data.vinos || data.recomendaciones || []) as MaridajeItem[];
      if (!vinos.length) {
        setResultHtml(
          <div className="glass-card p-4 text-sm" style={{ color: "var(--text-dim)" }}>
            No se encontraron maridajes para {selectedNombre}
          </div>
        );
        return;
      }

      setResultHtml(
        <div className="space-y-3">
          <div className="section-label">Maridajes para {selectedNombre}</div>
          {vinos.map((v, i) => {
            const nombre = v.vino || v.nombre || "";
            const region = v.region || "";
            const varietal = v.varietal || v.tipo || "";
            const razon = v.razon || v.explicacion || v.descripcion || "";
            const poetica = v.nota_poetica || "";
            return (
              <div key={`${nombre}-${i}`} className="glass-card p-4">
                <div className="font-display text-xl" style={{ color: "var(--cream)" }}>
                  {nombre}
                </div>
                <div
                  className="mt-1 font-mono text-[0.55rem] uppercase tracking-wider"
                  style={{ color: "var(--gold)" }}
                >
                  {varietal} - {region}
                </div>
                {razon ? (
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                    {razon}
                  </p>
                ) : null}
                {poetica ? (
                  <p
                    className="mt-2 font-display italic text-sm"
                    style={{ color: "var(--gold-light)" }}
                  >
                    {poetica}
                  </p>
                ) : null}
              </div>
            );
          })}
          {data.consejo_maestro || data.consejo ? (
            <div className="glass-card p-4" style={{ borderColor: "var(--gold)" }}>
              <div className="section-label mb-2">Consejo del Sommelier</div>
              <p className="text-sm leading-relaxed">
                {String(data.consejo_maestro || data.consejo)}
              </p>
            </div>
          ) : null}
        </div>
      );
    } catch {
      setResultHtml(
        <div className="text-sm" style={{ color: "var(--text-dim)" }}>
          No se pudo conectar con el motor de maridaje. Verifica la conexion.
        </div>
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionHero
        greeting="Motor de maridaje"
        title={
          <>
            Cocina <em>dominicana</em>
            <br />
            + vino mundial
          </>
        }
      />

      <div className="mb-2 section-label">Platos tradicionales</div>
      <div className="mb-6 grid grid-cols-2 gap-3">
        {PLATOS_TRADICIONALES.map((p) => {
          const active = platoId === p.id && !platoLibre.trim();
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPlatoId(p.id);
                setPlatoLibre("");
              }}
              className="group overflow-hidden rounded-temple text-left transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                border: `1px solid ${active ? "var(--gold)" : "var(--glass-border)"}`,
                boxShadow: active ? "0 0 0 1px var(--gold)" : "var(--glass-shadow)",
              }}
            >
              <div className={`relative flex h-24 items-end bg-gradient-to-br ${p.tone} p-3`}>
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15), transparent 50%)",
                  }}
                />
                <div className="relative">
                  <div className="font-display text-lg text-[#f5efe0]">{p.nombre}</div>
                  <div className="font-mono text-[0.5rem] uppercase tracking-wider text-[#c8bfa8]">
                    {p.desc}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <label className="mb-2 block section-label">O escribe tu plato</label>
      <input
        className="input-temple mb-4"
        value={platoLibre}
        onChange={(e) => setPlatoLibre(e.target.value)}
        placeholder="Ej: Pernil de cerdo asado..."
      />

      <label className="mb-2 block section-label">Presupuesto</label>
      <select
        className="input-temple mb-5"
        value={presupuesto}
        onChange={(e) => setPresupuesto(e.target.value)}
      >
        {PRESUPUESTOS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <button type="button" className="btn-primary mb-6" onClick={buscar} disabled={loading}>
        {loading ? "Consultando al Maestro..." : "Descubrir Maridaje"}
      </button>

      {resultHtml}
    </div>
  );
}

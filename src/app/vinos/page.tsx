"use client";

import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { WineBottleCard } from "@/components/vinos/WineBottleCard";
import { WineDetailOverlay } from "@/components/vinos/WineDetailOverlay";
import {
  type Vino,
  buscarVinos as apiBuscar,
  vinosPorTipo,
  vinosRecomendados,
} from "@/lib/api";

const FILTERS = [
  { id: "todos", label: "Todos", color: null },
  { id: "tinto", label: "Tintos", color: "#722F37", api: "tintos" },
  { id: "blanco", label: "Blancos", color: "#E8D5A3", api: "blancos" },
  { id: "espumoso", label: "Espumosos", color: "#F5EFE0", api: "espumoso" },
  { id: "rosado", label: "Rosados", color: "#FFB7C5", api: "rosados" },
] as const;

export default function VinosPage() {
  const [allVinos, setAllVinos] = useState<Vino[]>([]);
  const [vinos, setVinos] = useState<Vino[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("todos");
  const [selected, setSelected] = useState<Vino | null>(null);

  useEffect(() => {
    vinosRecomendados()
      .then((data) => {
        const list = data.vinos || [];
        setAllVinos(list);
        setVinos(list);
      })
      .catch(() => setVinos([]))
      .finally(() => setLoading(false));
  }, []);

  const onSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) {
      setVinos(allVinos);
      return;
    }
    setLoading(true);
    try {
      const data = await apiBuscar(q);
      setVinos(data.vinos || []);
    } catch {
      setVinos([]);
    } finally {
      setLoading(false);
    }
  }, [query, allVinos]);

  const onFilter = async (id: string, api?: string) => {
    setFilter(id);
    if (id === "todos") {
      setVinos(allVinos);
      return;
    }
    setLoading(true);
    try {
      const data = await vinosPorTipo(api || id);
      setVinos(data.vinos || []);
    } catch {
      setVinos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#2a0808]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-0 h-64 w-64 rounded-full bg-[#800020]/18 blur-3xl" />

      <div className="relative pb-2 pt-1 text-center">
        <div className="mb-2 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[var(--gold)]">
          Catalogo
        </div>
        <h1 className="font-display text-4xl font-light text-[#f5efe0] drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
          Explora <em className="text-[var(--gold)]">vinos</em>
        </h1>
      </div>

      <div className="relative mb-4 mt-5 flex gap-2">
        <input
          className="input-temple flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Buscar vino, varietal, region..."
        />
        <button
          type="button"
          onClick={onSearch}
          className="rounded-temple-sm px-4 font-mono text-sm"
          style={{ border: "1px solid var(--border)", color: "var(--gold)", background: "var(--glass-bg)" }}
          aria-label="Buscar"
        >
          ⌕
        </button>
      </div>

      <div className="relative mb-6 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilter(f.id, "api" in f ? f.api : undefined)}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-wider transition-colors"
            style={{
              border: `1px solid ${filter === f.id ? "var(--gold)" : "rgba(255,255,255,0.12)"}`,
              color: filter === f.id ? "var(--gold)" : "var(--text-dim)",
              background: filter === f.id ? "rgba(42,8,8,0.65)" : "rgba(0,0,0,0.35)",
              backdropFilter: "blur(10px)",
            }}
          >
            {f.color ? <span className="h-2 w-2 rounded-full" style={{ background: f.color }} /> : null}
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Cargando bodega..." />
      ) : vinos.length === 0 ? (
        <p className="relative py-8 text-center text-sm text-[#c8bfa8]">No se encontraron vinos.</p>
      ) : (
        <div className="relative grid grid-cols-1 gap-4">
          {vinos.map((v) => (
            <WineBottleCard
              key={v.nombre + (v.bodega || "")}
              vino={v}
              onClick={() => setSelected(v)}
            />
          ))}
        </div>
      )}

      <WineDetailOverlay vino={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { SectionHero } from "@/components/ui/SectionHero";
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
    <div>
      <SectionHero greeting="Catalogo" title={<>Explora <em>vinos</em></>} />

      <div className="mb-4 flex gap-2">
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

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilter(f.id, "api" in f ? f.api : undefined)}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-wider transition-colors"
            style={{
              border: `1px solid ${filter === f.id ? "var(--gold)" : "var(--border)"}`,
              color: filter === f.id ? "var(--gold)" : "var(--text-dim)",
              background: filter === f.id ? "var(--radial-glow)" : "transparent",
            }}
          >
            {f.color ? (
              <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
            ) : null}
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Cargando bodega..." />
      ) : vinos.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-dim)" }}>
          No se encontraron vinos.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {vinos.map((v) => (
            <WineBottleCard key={v.nombre + (v.bodega || "")} vino={v} onClick={() => setSelected(v)} />
          ))}
        </div>
      )}

      <WineDetailOverlay vino={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionHero } from "@/components/ui/SectionHero";
import { readBodega, removeFromBodega } from "@/lib/bodega";
import { COLORES_VINO, type Vino, vinosRecomendados } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";

function BottleSlot({
  nombre,
  vino,
  onRemove,
  delay,
}: {
  nombre: string;
  vino?: Vino;
  onRemove: () => void;
  delay: number;
}) {
  const tipo = (vino?.tipo || "tinto").toLowerCase();
  const color = COLORES_VINO[tipo] || "#722F37";

  return (
    <div
      className="relative flex flex-col items-center animate-shelf-reveal"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem]"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-dim)" }}
        title="Remover"
        aria-label={`Remover ${nombre}`}
      >
        ×
      </button>
      <div
        className="relative flex h-28 w-12 items-end justify-center rounded-t-md"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), transparent)",
        }}
      >
        {vino?.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vino.imagen} alt={nombre} className="h-24 w-10 object-contain drop-shadow-lg" />
        ) : (
          <div
            className="mb-1 h-24 w-6 rounded-t-full rounded-b-sm"
            style={{
              background: `linear-gradient(180deg, ${color} 10%, #120606 100%)`,
              boxShadow: `0 8px 18px ${color}40`,
            }}
          >
            <div className="mx-auto mt-1 h-2 w-4 rounded-sm" style={{ background: "var(--gold)" }} />
          </div>
        )}
      </div>
      <div
        className="mt-1 w-full truncate px-0.5 text-center font-mono text-[0.45rem] uppercase tracking-wide"
        style={{ color: "var(--cream)" }}
        title={nombre}
      >
        {nombre}
      </div>
    </div>
  );
}

export default function BodegaPage() {
  const { showToast } = useToast();
  const [bodega, setBodega] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<Vino[]>([]);

  const refresh = () => setBodega(readBodega());

  useEffect(() => {
    refresh();
    vinosRecomendados()
      .then((d) => setCatalog(d.vinos || []))
      .catch(() => {});
    const onUpdate = () => refresh();
    window.addEventListener("bodega-updated", onUpdate);
    return () => window.removeEventListener("bodega-updated", onUpdate);
  }, []);

  const matching = useMemo(
    () => catalog.filter((v) => bodega.includes(v.nombre)),
    [catalog, bodega]
  );
  const varietales = new Set(matching.map((v) => v.varietal).filter(Boolean)).size;
  const paises = new Set(matching.map((v) => v.region).filter(Boolean)).size;

  // Virtual shelves: 4 bottles per shelf
  const shelves: string[][] = [];
  for (let i = 0; i < bodega.length; i += 4) {
    shelves.push(bodega.slice(i, i + 4));
  }
  if (shelves.length === 0) shelves.push([]);

  return (
    <div>
      <SectionHero
        greeting="Mi Bodega Personal"
        title={
          <>
            Tu <em>coleccion</em>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { value: bodega.length, label: "Botellas" },
          { value: varietales, label: "Varietales" },
          { value: paises, label: "Paises" },
        ].map((s) => (
          <div key={s.label} className="glass-card py-4 text-center">
            <div className="font-display text-3xl" style={{ color: "var(--gold)" }}>
              {s.value}
            </div>
            <div className="mt-1 font-mono text-[0.5rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {bodega.length === 0 ? (
        <div className="glass-card px-6 py-12 text-center">
          <div
            className="mx-auto mb-4 h-16 w-8 rounded-t-full rounded-b-sm opacity-60"
            style={{ background: "linear-gradient(180deg, #722F37, #1a0808)" }}
          />
          <div className="font-display text-xl" style={{ color: "var(--cream)" }}>
            Tu bodega esta vacia
          </div>
          <p className="mx-auto mt-2 max-w-xs text-sm" style={{ color: "var(--text-dim)" }}>
            Escanea vinos con Cata Lab o agrega desde el catalogo para comenzar tu
            coleccion personal.
          </p>
          <Link href="/catalab" className="btn-primary mt-6 inline-block w-auto px-8">
            Escanear primer vino
          </Link>
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-temple p-4"
          style={{
            background: "var(--bottle-shelf)",
            border: "1px solid var(--border)",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.25)",
          }}
        >
          <div className="section-label mb-4 text-center">Cava virtual</div>
          {shelves.map((row, si) => (
            <div key={si} className="mb-5 last:mb-0">
              <div className="grid grid-cols-4 gap-2 px-1 pb-2">
                {Array.from({ length: 4 }).map((_, i) => {
                  const nombre = row[i];
                  if (!nombre) {
                    return (
                      <div
                        key={`empty-${si}-${i}`}
                        className="flex h-28 items-end justify-center opacity-25"
                      >
                        <div
                          className="h-16 w-5 rounded-t-full border border-dashed"
                          style={{ borderColor: "var(--border)" }}
                        />
                      </div>
                    );
                  }
                  const vino = catalog.find((v) => v.nombre === nombre);
                  return (
                    <BottleSlot
                      key={nombre}
                      nombre={nombre}
                      vino={vino}
                      delay={si * 80 + i * 40}
                      onRemove={() => {
                        removeFromBodega(nombre);
                        refresh();
                        showToast("Removido de tu bodega");
                      }}
                    />
                  );
                })}
              </div>
              <div
                className="h-2.5 rounded-sm"
                style={{
                  background: "linear-gradient(180deg, var(--bottle-wood), #2a1810)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

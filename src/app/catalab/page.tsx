"use client";

import { useRef, useState } from "react";
import { SectionHero } from "@/components/ui/SectionHero";
import { analizarEtiqueta } from "@/lib/api";
import { addToBodega } from "@/lib/bodega";
import { useToast } from "@/components/providers/ToastProvider";

export default function CataLabPage() {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(false);

  function onFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(String(e.target?.result || ""));
      setResult(null);
    };
    reader.readAsDataURL(file);
  }

  async function analizar() {
    if (!preview) {
      showToast("Sube una imagen primero");
      return;
    }
    setLoading(true);
    setResult(
      <div className="flex flex-col items-center gap-3 py-8" style={{ color: "var(--text-dim)" }}>
        <div className="spinner" />
        <span className="font-mono text-[0.65rem]">El Maestro analiza la etiqueta...</span>
      </div>
    );
    try {
      const data = await analizarEtiqueta(preview);
      if (!data.success || !data.datos) {
        setResult(
          <div className="glass-card p-4" style={{ borderLeft: "3px solid #c0392b" }}>
            <div className="section-label mb-2" style={{ color: "#e07070" }}>
              Error del Maestro
            </div>
            <p className="text-sm">
              {data.error ||
                "No se pudo analizar la etiqueta. Intenta con una foto mas clara y bien iluminada."}
            </p>
          </div>
        );
        return;
      }

      const d = data.datos as Record<string, unknown>;
      const chips = [
        d.tipo,
        d.pais,
        d.region,
        d.denominacion_origen,
        d.cosecha ? `Cosecha ${d.cosecha}` : null,
        d.graduacion_alcoholica,
      ].filter(Boolean) as string[];
      const uvas = Array.isArray(d.uvas) ? (d.uvas as string[]) : [];
      const nombre = String(d.nombre || "Vino sin identificar");

      setResult(
        <div className="glass-card overflow-hidden" style={{ borderLeft: "3px solid var(--gold)" }}>
          <div className="p-4">
            <div className="section-label mb-2">Analisis del Maestro</div>
            <h2 className="font-display text-2xl" style={{ color: "var(--text)" }}>
              {nombre}
            </h2>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: "var(--gold)" }}>
              {String(d.bodega || "")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-wider"
                  style={{ border: "1px solid var(--border)", color: "var(--text-dim)" }}
                >
                  {c}
                </span>
              ))}
            </div>
            {uvas.length ? (
              <div className="mt-4">
                <div className="section-label mb-2">Uvas</div>
                <div className="flex flex-wrap gap-2">
                  {uvas.map((u) => (
                    <span key={u} className="rounded-temple-sm px-2 py-1 text-xs" style={{ background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {d.descripcion ? (
              <div className="mt-4">
                <div className="section-label mb-2">Descripcion</div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {String(d.descripcion)}
                </p>
              </div>
            ) : null}
            {d.nota_cata ? (
              <div className="mt-4">
                <div className="section-label mb-2">Nota de Cata</div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {String(d.nota_cata)}
                </p>
              </div>
            ) : null}
            {d.maridaje ? (
              <div className="mt-4">
                <div className="section-label mb-2">Maridaje recomendado</div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {String(d.maridaje)}
                </p>
              </div>
            ) : null}
            {d.precio_estimado_usd ? (
              <div className="mt-4">
                <div className="section-label mb-2">Precio estimado</div>
                <p className="font-display text-xl">{String(d.precio_estimado_usd)}</p>
              </div>
            ) : null}
            {typeof d.confianza === "number" ? (
              <p className="mt-4 text-right font-mono text-[0.55rem]" style={{ color: "var(--text-dim)" }}>
                Confianza: {Math.round((d.confianza as number) * 100)}%
              </p>
            ) : null}
          </div>
          <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                const r = addToBodega(nombre);
                showToast(r.already ? "Ya esta en tu bodega" : "Agregado a tu bodega");
              }}
            >
              + Agregar a mi bodega
            </button>
          </div>
        </div>
      );
    } catch {
      setResult(
        <div className="glass-card p-4 text-sm" style={{ color: "var(--text-dim)" }}>
          Error de conexion con Cata Lab. Verifica tu red e intenta de nuevo.
        </div>
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionHero
        greeting="Cata Lab"
        title={
          <>
            Escanea <em>etiquetas</em>
            <br />
            con IA
          </>
        }
        subtitle="Toma una foto de la etiqueta de cualquier vino y El Maestro te dara toda la informacion."
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="glass-card flex w-full flex-col items-center gap-2 px-4 py-10 transition-transform hover:-translate-y-0.5"
      >
        <div
          className="mb-1 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ border: "1px dashed var(--gold)", color: "var(--gold)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="13.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="font-display text-xl" style={{ color: "var(--text)" }}>
          Toca para escanear etiqueta
        </div>
        <div className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
          Sube una foto o usa tu camara
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </button>

      {preview ? (
        <div className="mt-5 space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="mx-auto max-h-56 rounded-temple object-contain"
            style={{ border: "1px solid var(--border)" }}
          />
          <button type="button" className="btn-primary" onClick={analizar} disabled={loading}>
            Analizar con El Maestro
          </button>
        </div>
      ) : null}

      <div className="mt-5">{result}</div>
    </div>
  );
}

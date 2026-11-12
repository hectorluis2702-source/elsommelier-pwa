"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  REGIONES,
  TIPO_COLOR,
  TIPO_LABEL,
  type Region,
  type RegionTipo,
} from "@/lib/regiones";
import { useTheme } from "@/components/providers/ThemeProvider";

type MapStyle = "dark" | "light" | "satellite";

const TILES: Record<MapStyle, { url: string; attribution: string }> = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
};

export function WineMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<import("leaflet").Map | null>(null);
  const tileRef = useRef<import("leaflet").TileLayer | null>(null);
  const markersRef = useRef<import("leaflet").LayerGroup | null>(null);
  const { theme } = useTheme();

  const [mapStyle, setMapStyle] = useState<MapStyle>(theme === "light" ? "light" : "dark");
  const [selected, setSelected] = useState<Region | null>(null);
  const [zonaIdx, setZonaIdx] = useState<number | null>(null);
  const [filterTipo, setFilterTipo] = useState<RegionTipo | "todos">("todos");

  const filtered = useMemo(
    () => (filterTipo === "todos" ? REGIONES : REGIONES.filter((r) => r.t === filterTipo)),
    [filterTipo]
  );

  // Sync default style with theme when user hasn't forced satellite
  useEffect(() => {
    if (mapStyle !== "satellite") {
      setMapStyle(theme === "light" ? "light" : "dark");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      // CSS imported once via side-effect in this client module
      if (cancelled || !mapRef.current || mapObj.current) return;

      const map = L.map(mapRef.current, {
        center: [20, 5],
        zoom: 2,
        zoomControl: true,
        attributionControl: true,
      });
      mapObj.current = map;

      const tile = L.tileLayer(TILES[mapStyle].url, {
        attribution: TILES[mapStyle].attribution,
        maxZoom: 19,
      }).addTo(map);
      tileRef.current = tile;

      markersRef.current = L.layerGroup().addTo(map);

      // Expose select helper on window for popup buttons
      (window as unknown as { __selectRegion?: (name: string) => void }).__selectRegion = (
        name: string
      ) => {
        const r = REGIONES.find((x) => x.n === name);
        if (r) {
          setSelected(r);
          setZonaIdx(null);
        }
      };

      setTimeout(() => map.invalidateSize(), 100);
    }

    init();
    return () => {
      cancelled = true;
      mapObj.current?.remove();
      mapObj.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update tiles
  useEffect(() => {
    async function swap() {
      if (!mapObj.current) return;
      const L = (await import("leaflet")).default;
      if (tileRef.current) mapObj.current.removeLayer(tileRef.current);
      tileRef.current = L.tileLayer(TILES[mapStyle].url, {
        attribution: TILES[mapStyle].attribution,
        maxZoom: 19,
      }).addTo(mapObj.current);
    }
    swap();
  }, [mapStyle]);

  // Update markers
  useEffect(() => {
    async function redraw() {
      if (!mapObj.current || !markersRef.current) return;
      const L = (await import("leaflet")).default;
      markersRef.current.clearLayers();

      filtered.forEach((r) => {
        const color = TIPO_COLOR[r.t];
        const icon = L.divIcon({
          html: `<div class="wine-marker" style="background:${color};width:14px;height:14px;"></div>`,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -10],
        });
        const popup = `
          <div style="min-width:200px;max-width:260px;padding:0.25rem">
            <h3 style="font-family:serif;font-size:1.1rem;margin:0 0 0.25rem">${r.n}</h3>
            <div style="font-size:0.7rem;opacity:0.7;margin-bottom:0.4rem">${r.p}</div>
            <span style="display:inline-block;padding:0.15rem 0.5rem;border-radius:999px;font-size:0.6rem;background:${color};color:#fff">${TIPO_LABEL[r.t]}</span>
            <div style="margin-top:0.5rem;font-size:0.75rem"><strong>Uvas:</strong> ${r.uvas}</div>
            <button type="button" onclick="window.__selectRegion && window.__selectRegion('${r.n.replace(/'/g, "\\'")}')"
              style="margin-top:0.6rem;width:100%;padding:0.4rem;border-radius:8px;border:1px solid #c9a84c;background:transparent;color:#c9a84c;font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer">
              Explorar zona
            </button>
          </div>`;
        L.marker(r.ll, { icon })
          .bindPopup(popup, { maxWidth: 300 })
          .addTo(markersRef.current!);
      });
    }
    redraw();
  }, [filtered]);

  const zona = selected && zonaIdx !== null ? selected.zonas?.[zonaIdx] : null;

  return (
    <div className="-mx-4">
      <div className="mb-3 flex flex-wrap items-center gap-2 px-4">
        {(
          [
            { id: "dark", label: "Nocturno" },
            { id: "light", label: "Diurno" },
            { id: "satellite", label: "Satelite" },
          ] as const
        ).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setMapStyle(s.id)}
            className="rounded-full px-3 py-1 font-mono text-[0.55rem] uppercase tracking-wider"
            style={{
              border: `1px solid ${mapStyle === s.id ? "var(--gold)" : "var(--border)"}`,
              color: mapStyle === s.id ? "var(--gold)" : "var(--text-dim)",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto px-4" style={{ scrollbarWidth: "none" }}>
        <button
          type="button"
          onClick={() => setFilterTipo("todos")}
          className="shrink-0 rounded-full px-3 py-1 font-mono text-[0.55rem] uppercase tracking-wider"
          style={{
            border: `1px solid ${filterTipo === "todos" ? "var(--gold)" : "var(--border)"}`,
            color: filterTipo === "todos" ? "var(--gold)" : "var(--text-dim)",
          }}
        >
          Todas
        </button>
        {(Object.keys(TIPO_LABEL) as RegionTipo[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilterTipo(t)}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.55rem] uppercase tracking-wider"
            style={{
              border: `1px solid ${filterTipo === t ? "var(--gold)" : "var(--border)"}`,
              color: filterTipo === t ? "var(--gold)" : "var(--text-dim)",
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: TIPO_COLOR[t] }} />
            {TIPO_LABEL[t]}
          </button>
        ))}
      </div>

      <div
        ref={mapRef}
        id="wine-map"
        className="h-[52vh] min-h-[320px] w-full"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      />

      {/* Hierarchical panel: Región → Zona → Viñedo */}
      <div className="space-y-3 px-4 pt-4">
        {selected ? (
          <div className="glass-card p-4 animate-section-in">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <div className="section-label">Region</div>
                <h3 className="font-display text-2xl" style={{ color: "var(--cream)" }}>
                  {selected.n}
                </h3>
                <p className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: "var(--gold)" }}>
                  {selected.p} · {TIPO_LABEL[selected.t]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setZonaIdx(null);
                }}
                className="font-mono text-[0.6rem]"
                style={{ color: "var(--text-dim)" }}
              >
                Cerrar
              </button>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
              {selected.d}
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--text-dim)" }}>
              <strong style={{ color: "var(--gold)" }}>Uvas:</strong> {selected.uvas}
            </p>

            {selected.zonas?.length ? (
              <div className="mt-4">
                <div className="section-label mb-2">Zonas</div>
                <div className="flex flex-wrap gap-2">
                  {selected.zonas.map((z, i) => (
                    <button
                      key={z.nombre}
                      type="button"
                      onClick={() => setZonaIdx(i)}
                      className="rounded-temple-sm px-3 py-2 font-mono text-[0.55rem] uppercase tracking-wider"
                      style={{
                        border: `1px solid ${zonaIdx === i ? "var(--gold)" : "var(--border)"}`,
                        color: zonaIdx === i ? "var(--gold)" : "var(--text)",
                        background: zonaIdx === i ? "var(--radial-glow)" : "transparent",
                      }}
                    >
                      {z.nombre}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 font-mono text-[0.55rem]" style={{ color: "var(--text-dim)" }}>
                Detalle de viñedos disponible pronto para esta región.
              </p>
            )}

            {zona ? (
              <div className="mt-4 animate-section-in">
                <div className="section-label mb-2">Vinedos · {zona.nombre}</div>
                <div className="space-y-2">
                  {zona.vinedos.map((v) => (
                    <div
                      key={v.nombre}
                      className="flex items-center justify-between rounded-temple-sm px-3 py-2.5"
                      style={{ background: "var(--glass-bg)", border: "1px solid var(--border)" }}
                    >
                      <span className="font-display text-base" style={{ color: "var(--cream)" }}>
                        {v.nombre}
                      </span>
                      {v.nota ? (
                        <span className="font-mono text-[0.5rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                          {v.nota}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-center font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
            Toca cualquier punto para explorar la region
          </p>
        )}
      </div>
    </div>
  );
}

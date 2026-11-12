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
import { getMapToken, hasMapToken, tileForStyle, type MapStyle } from "@/lib/mapConfig";

export function WineMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<import("leaflet").Map | null>(null);
  const tileRef = useRef<import("leaflet").TileLayer | null>(null);
  const markersRef = useRef<import("leaflet").LayerGroup | null>(null);
  const { theme } = useTheme();

  const tokenPresent = hasMapToken();
  const [mapStyle, setMapStyle] = useState<MapStyle>(theme === "light" ? "light" : "dark");
  const [selected, setSelected] = useState<Region | null>(null);
  const [zonaIdx, setZonaIdx] = useState<number | null>(null);
  const [filterTipo, setFilterTipo] = useState<RegionTipo | "todos">("todos");
  const [tileError, setTileError] = useState(false);

  const filtered = useMemo(
    () => (filterTipo === "todos" ? REGIONES : REGIONES.filter((r) => r.t === filterTipo)),
    [filterTipo]
  );

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
      if (cancelled || !mapRef.current || mapObj.current) return;

      // Prevent broken default marker icon 404s from Leaflet's imagePath
      const proto = L.Icon.Default.prototype as unknown as {
        _getIconUrl?: unknown;
      };
      delete proto._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [20, 5],
        zoom: 2,
        zoomControl: true,
        attributionControl: true,
      });
      mapObj.current = map;

      const cfg = tileForStyle(mapStyle);
      const tile = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom,
        // Keep Mapbox token out of error strings in UI
        crossOrigin: true,
      });

      tile.on("tileerror", () => {
        // Only surface errors when a paid key was expected
        if (getMapToken()) setTileError(true);
      });
      tile.on("load", () => setTileError(false));
      tile.addTo(map);
      tileRef.current = tile;

      markersRef.current = L.layerGroup().addTo(map);

      (window as unknown as { __selectRegion?: (name: string) => void }).__selectRegion = (
        name: string
      ) => {
        const r = REGIONES.find((x) => x.n === name);
        if (r) {
          setSelected(r);
          setZonaIdx(null);
        }
      };

      setTimeout(() => map.invalidateSize(), 120);
      setTimeout(() => map.invalidateSize(), 400);
    }

    init();
    return () => {
      cancelled = true;
      mapObj.current?.remove();
      mapObj.current = null;
      tileRef.current = null;
      markersRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function swap() {
      if (!mapObj.current) return;
      const L = (await import("leaflet")).default;
      if (tileRef.current) mapObj.current.removeLayer(tileRef.current);
      const cfg = tileForStyle(mapStyle);
      const tile = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom,
        crossOrigin: true,
      });
      tile.on("tileerror", () => {
        if (getMapToken()) setTileError(true);
      });
      tile.on("load", () => setTileError(false));
      tile.addTo(mapObj.current);
      tileRef.current = tile;
      setTimeout(() => mapObj.current?.invalidateSize(), 80);
    }
    swap();
  }, [mapStyle]);

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
            <h3 style="font-family:serif;font-size:1.15rem;margin:0 0 0.25rem;color:#f5efe0">${r.n}</h3>
            <div style="font-size:0.75rem;opacity:0.75;margin-bottom:0.4rem">${r.p}</div>
            <span style="display:inline-block;padding:0.15rem 0.5rem;border-radius:999px;font-size:0.65rem;background:${color};color:#fff">${TIPO_LABEL[r.t]}</span>
            <div style="margin-top:0.5rem;font-size:0.8rem"><strong>Uvas:</strong> ${r.uvas}</div>
            <button type="button" onclick="window.__selectRegion && window.__selectRegion('${r.n.replace(/'/g, "\\'")}')"
              style="margin-top:0.6rem;width:100%;padding:0.45rem;border-radius:8px;border:1px solid #c9a84c;background:transparent;color:#c9a84c;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer">
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
    <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14">
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
            className="rounded-full px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-wider"
            style={{
              border: `1px solid ${mapStyle === s.id ? "var(--gold)" : "var(--border)"}`,
              color: mapStyle === s.id ? "var(--gold)" : "var(--text-dim)",
            }}
          >
            {s.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-[0.5rem] uppercase tracking-wider text-[var(--text-dim)]">
          {tokenPresent ? "Mapbox" : "OpenStreetMap"}
        </span>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto px-4" style={{ scrollbarWidth: "none" }}>
        <button
          type="button"
          onClick={() => setFilterTipo("todos")}
          className="shrink-0 rounded-full px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-wider"
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
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-wider"
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

      {tileError ? (
        <div className="mx-4 mb-3 rounded-temple-sm border border-[var(--gold)]/40 bg-black/50 px-3 py-2 text-sm text-[#e8dfd0]">
          No se pudieron cargar los tiles de Mapbox. Revisa{" "}
          <code className="text-[var(--gold)]">NEXT_PUBLIC_MAPBOX_TOKEN</code> en Vercel y
          redespliega. Mientras tanto puedes usar la vista OpenStreetMap quitando el token.
        </div>
      ) : null}

      <div
        ref={mapRef}
        id="wine-map"
        className="h-[52vh] min-h-[320px] w-full bg-[#121212]"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      />

      <div className="space-y-3 px-4 pt-4">
        {selected ? (
          <div className="rounded-temple border border-[var(--border)] bg-[var(--bg-elevated)] p-5 animate-section-in">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <div className="section-label text-[0.65rem]">Region</div>
                <h3 className="font-display text-2xl text-[var(--cream)]">{selected.n}</h3>
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--gold)]">
                  {selected.p} · {TIPO_LABEL[selected.t]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setZonaIdx(null);
                }}
                className="font-mono text-[0.7rem] text-[var(--text-dim)]"
              >
                Cerrar
              </button>
            </div>
            <p className="text-base leading-relaxed text-[var(--text)]">{selected.d}</p>
            <p className="mt-3 text-sm text-[var(--text)]">
              <strong className="text-[var(--gold)]">Uvas:</strong> {selected.uvas}
            </p>

            {selected.zonas?.length ? (
              <div className="mt-4">
                <div className="section-label mb-2 text-[0.65rem]">Zonas</div>
                <div className="flex flex-wrap gap-2">
                  {selected.zonas.map((z, i) => (
                    <button
                      key={z.nombre}
                      type="button"
                      onClick={() => setZonaIdx(i)}
                      className="rounded-temple-sm px-3 py-2 font-mono text-[0.65rem] uppercase tracking-wider"
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
              <p className="mt-3 font-mono text-[0.65rem] text-[var(--text-dim)]">
                Detalle de viñedos disponible pronto para esta región.
              </p>
            )}

            {zona ? (
              <div className="mt-4 animate-section-in">
                <div className="section-label mb-2 text-[0.65rem]">Vinedos · {zona.nombre}</div>
                <div className="space-y-2">
                  {zona.vinedos.map((v) => (
                    <div
                      key={v.nombre}
                      className="flex items-center justify-between rounded-temple-sm border border-[var(--border)] bg-[var(--glass-bg)] px-3 py-3"
                    >
                      <span className="font-display text-lg text-[var(--cream)]">{v.nombre}</span>
                      {v.nota ? (
                        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[var(--text-dim)]">
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
          <p className="text-center font-mono text-[0.7rem] uppercase tracking-wider text-[var(--text-dim)]">
            Toca cualquier punto para explorar la region
          </p>
        )}
      </div>
    </div>
  );
}

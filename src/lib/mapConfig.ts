/**
 * Map tile config.
 * Set NEXT_PUBLIC_MAPBOX_TOKEN (or NEXT_PUBLIC_MAP_API_KEY) in Vercel / .env.local
 * to enable Mapbox streets/satellite. Without a key we use free OSM/CARTO tiles
 * so the map never shows an API-key error banner.
 */

export type MapStyle = "dark" | "light" | "satellite";

export function getMapToken(): string {
  return (
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAP_API_KEY ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    ""
  ).trim();
}

export function hasMapToken(): boolean {
  return getMapToken().length > 0;
}

export function tileForStyle(style: MapStyle): {
  url: string;
  attribution: string;
  maxZoom: number;
} {
  const token = getMapToken();

  if (token) {
    const id =
      style === "satellite"
        ? "mapbox/satellite-streets-v12"
        : style === "light"
          ? "mapbox/light-v11"
          : "mapbox/dark-v11";
    return {
      url: `https://api.mapbox.com/styles/v1/${id}/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`,
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 20,
    };
  }

  // Free fallbacks — no API key required
  if (style === "satellite") {
    return {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles © Esri",
      maxZoom: 19,
    };
  }
  if (style === "light") {
    return {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    };
  }
  return {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  };
}

/** Backend API — preserved from legacy PWA */
export const API_BASE = "https://elsommelier-backend.vercel.app";

export type WineRating = {
  promedio?: number;
  fuente?: string;
};

export type Vino = {
  nombre: string;
  bodega?: string;
  region?: string;
  pais?: string;
  tipo?: string;
  varietal?: string;
  denominacion_origen?: string;
  descripcion?: string;
  notas_cata?: string;
  maridajes?: string[] | string;
  precio_rango?: string;
  imagen?: string;
  rating?: WineRating;
  puntuacion_rd?: number;
};

export type Leccion = {
  slug: string;
  titulo: string;
  nivel?: string;
  orden?: number;
  duracion_estimada?: number;
  imagen_url?: string;
  objetivos?: string[];
  contenido_teorico?: string;
  ejemplos_practicos?: unknown;
  quiz?: unknown;
};

async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function askSommelier(
  mensaje: string,
  historial: { role: string; content: string }[]
) {
  return getJson<{ respuesta?: string; error?: string }>("/api/sommelier", {
    method: "POST",
    body: JSON.stringify({ mensaje, historial }),
  });
}

export async function analizarEtiqueta(imagen: string) {
  return getJson<{
    success?: boolean;
    error?: string;
    datos?: Record<string, unknown>;
  }>("/api/scanner/analizar", {
    method: "POST",
    body: JSON.stringify({ imagen }),
  });
}

export async function maridajeParaPlato(plato: string) {
  return getJson<Record<string, unknown>>(
    `/api/maridaje/vinos-para/${encodeURIComponent(plato)}`
  );
}

export async function vinosRecomendados() {
  return getJson<{ vinos?: Vino[] }>("/api/vinos/recomendados");
}

export async function buscarVinos(q: string) {
  return getJson<{ vinos?: Vino[] }>(
    `/api/vinos/buscar/${encodeURIComponent(q)}`
  );
}

export async function vinosPorTipo(tipo: string) {
  return getJson<{ vinos?: Vino[] }>(`/api/vinos/tipo/${tipo}`);
}

export async function listarLecciones() {
  return getJson<{ success?: boolean; lecciones?: Leccion[] }>(
    "/api/academia/lecciones"
  );
}

export async function detalleLeccion(slug: string) {
  return getJson<{ success?: boolean; leccion?: Leccion }>(
    `/api/academia/lecciones/${slug}`
  );
}

export const COLORES_VINO: Record<string, string> = {
  tintos: "#722F37",
  tinto: "#722F37",
  reds: "#722F37",
  blancos: "#E8D5A3",
  blanco: "#E8D5A3",
  whites: "#E8D5A3",
  rosados: "#FFB7C5",
  rosado: "#FFB7C5",
  espumoso: "#F5EFE0",
  espumosos: "#F5EFE0",
  naranja: "#E8882A",
  dulce: "#C8860B",
};

export function calcularPuntuacionRD(puntuacion?: number | null) {
  if (!puntuacion) return null;
  return Math.min(100, Math.max(80, puntuacion - 1));
}

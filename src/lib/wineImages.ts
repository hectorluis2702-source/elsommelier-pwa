/**
 * Vivino CDN hotlinks return 403 in browsers — override with curated
 * thematic bottle/cellar photography (Unsplash) keyed by wine name.
 */
const BY_NAME: Record<string, string> = {
  "château margaux":
    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80",
  "chateau margaux":
    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80",
  "vega sicilia único":
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80",
  "vega sicilia unico":
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80",
  "dom pérignon vintage":
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80",
  "dom perignon vintage":
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80",
  "catena zapata malbec adrianna vineyard":
    "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=900&q=80",
  "antinori tignanello":
    "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=900&q=80",
  "concha y toro don melchor":
    "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=900&q=80",
  "zuccardi valle de uco malbec":
    "https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?auto=format&fit=crop&w=900&q=80",
  "protos reserva":
    "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=900&q=80",
  "taylor fladgate 10 year old tawny port":
    "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=900&q=80",
  "faustino i gran reserva":
    "https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&w=900&q=80",
  "cloudy bay sauvignon blanc":
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=900&q=80",
  "albariño martín códax":
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=900&q=80",
  "albarino martin codax":
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=900&q=80",
  "whispering angel rosé":
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80",
  "whispering angel rose":
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80",
  "marqués de riscal reserva":
    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80",
  "marques de riscal reserva":
    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80",
  "veuve clicquot yellow label brut":
    "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=900&q=80",
  "moët & chandon brut impérial":
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80",
  "moet & chandon brut imperial":
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80",
};

function normalize(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Prefer curated image; skip broken Vivino hotlinks */
export function resolveWineImage(nombre?: string, apiImagen?: string | null) {
  if (nombre) {
    const key = nombre.toLowerCase().trim();
    const ascii = normalize(nombre);
    if (BY_NAME[key]) return BY_NAME[key];
    if (BY_NAME[ascii]) return BY_NAME[ascii];
    // fuzzy contains
    for (const [k, url] of Object.entries(BY_NAME)) {
      if (ascii.includes(normalize(k)) || normalize(k).includes(ascii)) return url;
    }
  }
  if (apiImagen && !/vivino\.com/i.test(apiImagen)) return apiImagen;
  return null;
}

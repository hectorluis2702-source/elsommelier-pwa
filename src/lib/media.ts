/** Stock media — Pexels / Unsplash CDN (free to use) */

export const HERO_VIDEO =
  "https://videos.pexels.com/video-files/3209829/3209829-uhd_2560_1440_25fps.mp4";

export const HERO_VIDEO_POSTER =
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1400&q=80";

export const PLATO_IMAGES: Record<string, string> = {
  mofongo:
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
  sancocho:
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
  "chivo-guisado":
    "https://images.unsplash.com/photo-1432136972651-eea01b5997a0?auto=format&fit=crop&w=900&q=80",
  pastelon:
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80",
  mangu:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  "pollo-guisado":
    "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=80",
  "pescado-al-coco":
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
  chicharron:
    "https://images.unsplash.com/photo-1527477396000-e27173b57283?auto=format&fit=crop&w=900&q=80",
  "la-bandera":
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
  "locrio-de-pollo":
    "https://images.unsplash.com/photo-1604908177453-74629501a0d1?auto=format&fit=crop&w=900&q=80",
  asopao:
    "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=80",
  yaroa:
    "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=900&q=80",
};

export const WINE_FALLBACKS = [
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?auto=format&fit=crop&w=900&q=80",
];

export const ACADEMIA_IMAGES = [
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?auto=format&fit=crop&w=1000&q=80",
];

export function wineFallback(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % WINE_FALLBACKS.length;
  return WINE_FALLBACKS[h];
}

export function academiaImage(index: number) {
  return ACADEMIA_IMAGES[index % ACADEMIA_IMAGES.length];
}

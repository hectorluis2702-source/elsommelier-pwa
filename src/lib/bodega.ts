const KEY = "mi_bodega";

export function readBodega(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function writeBodega(bodega: string[]) {
  localStorage.setItem(KEY, JSON.stringify(bodega));
  window.dispatchEvent(new CustomEvent("bodega-updated", { detail: bodega }));
}

export function addToBodega(nombre: string): { ok: boolean; already: boolean } {
  const bodega = readBodega();
  if (bodega.includes(nombre)) return { ok: false, already: true };
  bodega.push(nombre);
  writeBodega(bodega);
  return { ok: true, already: false };
}

export function removeFromBodega(nombre: string) {
  writeBodega(readBodega().filter((v) => v !== nombre));
}

export function toggleBodega(nombre: string): boolean {
  const bodega = readBodega();
  const yaEsta = bodega.includes(nombre);
  if (yaEsta) {
    writeBodega(bodega.filter((v) => v !== nombre));
    return false;
  }
  bodega.push(nombre);
  writeBodega(bodega);
  return true;
}

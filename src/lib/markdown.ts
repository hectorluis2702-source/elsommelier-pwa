/** Markdown básico — tipografía ampliada y alto contraste para lecciones */
export function mdToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /^### (.+)$/gm,
      '<h3 style="font-family:var(--font-cormorant),serif;font-size:1.35rem;color:#f5efe0;margin:1.5rem 0 0.6rem;line-height:1.3">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="font-family:var(--font-cormorant),serif;font-size:1.55rem;color:#f5efe0;margin:1.9rem 0 0.7rem;border-bottom:1px solid rgba(201,168,76,0.35);padding-bottom:0.45rem;line-height:1.3">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 style="font-family:var(--font-cormorant),serif;font-size:1.85rem;color:#f5efe0;margin:0 0 1rem;line-height:1.25">$1</h1>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f5efe0;font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#e0c070">$1</em>')
    .replace(
      /^- (.+)$/gm,
      '<div style="margin:0 0 0.65rem;padding-left:0.85rem;border-left:2px solid rgba(201,168,76,0.45);color:#e8dfd0;font-size:1.05rem;line-height:1.55">$1</div>'
    )
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "\n");
}

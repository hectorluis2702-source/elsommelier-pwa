/** Markdown básico — tipografía ampliada y contraste adaptativo al tema */
export function mdToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /^### (.+)$/gm,
      '<h3 style="font-family:var(--font-cormorant),serif;font-size:1.45rem;color:var(--text);margin:1.6rem 0 0.7rem;line-height:1.35">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="font-family:var(--font-cormorant),serif;font-size:1.7rem;color:var(--text);margin:2rem 0 0.8rem;border-bottom:1px solid var(--border);padding-bottom:0.5rem;line-height:1.35">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 style="font-family:var(--font-cormorant),serif;font-size:2rem;color:var(--text);margin:0 0 1.1rem;line-height:1.25">$1</h1>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text);font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:var(--gold)">$1</em>')
    .replace(
      /^- (.+)$/gm,
      '<div style="margin:0 0 0.65rem;padding-left:0.85rem;border-left:2px solid var(--border-hover);color:var(--text);font-size:1.05rem;line-height:1.55">$1</div>'
    )
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "\n");
}

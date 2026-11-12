/** Markdown básico preservado del legacy */
export function mdToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /^### (.+)$/gm,
      '<h3 style="font-family:var(--font-cormorant),serif;font-size:1.1rem;color:var(--cream);margin:1.4rem 0 0.5rem">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="font-family:var(--font-cormorant),serif;font-size:1.3rem;color:var(--cream);margin:1.8rem 0 0.6rem;border-bottom:1px solid var(--border);padding-bottom:0.4rem">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 style="font-family:var(--font-cormorant),serif;font-size:1.5rem;color:var(--cream);margin:0 0 1rem">$1</h1>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--cream)">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:var(--gold-light)">$1</em>')
    .replace(
      /^- (.+)$/gm,
      '<div class="mb-2 pl-3 border-l border-[var(--border)] text-[var(--text-dim)] text-sm">$1</div>'
    )
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "\n");
}

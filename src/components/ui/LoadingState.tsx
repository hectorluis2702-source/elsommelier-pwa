export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10" style={{ color: "var(--text-dim)" }}>
      <div className="spinner" />
      <span className="font-mono text-[0.65rem] tracking-wider">{label}</span>
    </div>
  );
}

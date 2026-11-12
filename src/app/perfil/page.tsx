export default function PerfilPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col items-center pt-4 text-center">
        <div
          className="mb-3 flex h-20 w-20 items-center justify-center rounded-full font-display text-3xl"
          style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}
        >
          S
        </div>
        <h1 className="font-display text-2xl" style={{ color: "var(--cream)" }}>
          Estudiante
        </h1>
        <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
          Nivel Bronce - Iniciado
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { value: "0", label: "Lecciones" },
          { value: "0", label: "XP" },
          { value: "0", label: "Racha dias" },
        ].map((s) => (
          <div key={s.label} className="glass-card py-4 text-center">
            <div className="font-display text-2xl" style={{ color: "var(--gold)" }}>
              {s.value}
            </div>
            <div className="mt-1 font-mono text-[0.5rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <article className="glass-card mb-3 p-4">
        <div className="section-label mb-2">Plan actual</div>
        <h2 className="font-display text-xl" style={{ color: "var(--cream)" }}>
          Bronce — Gratuito
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>
          15 lecciones - Quiz interactivos - Acceso a El Maestro AI
        </p>
      </article>

      <article className="glass-card mb-3 p-4" style={{ borderColor: "rgba(184,134,11,0.35)" }}>
        <div className="section-label mb-2" style={{ color: "var(--gold)" }}>
          Actualizar a Plata
        </div>
        <h2 className="font-display text-xl" style={{ color: "var(--cream)" }}>
          $9.99 / mes
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>
          18 lecciones avanzadas - Cata Lab SAT - Bodega personal - Sin limites con El Maestro
        </p>
      </article>

      <article className="glass-card p-4" style={{ borderColor: "rgba(184,134,11,0.55)" }}>
        <div className="section-label mb-2" style={{ color: "var(--gold-light)" }}>
          Actualizar a Oro
        </div>
        <h2 className="font-display text-xl" style={{ color: "var(--cream)" }}>
          $29.99 / mes
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>
          12 lecciones master - Certificacion SAT - Spider Graph avanzado - Maridaje personalizado -
          Soporte prioritario
        </p>
      </article>
    </div>
  );
}

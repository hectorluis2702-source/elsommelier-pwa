import Link from "next/link";
import {
  IconCamera,
  IconCellar,
  IconGraduation,
  IconUtensils,
  IconWine,
} from "@/components/icons/NavIcons";

const QUICK = [
  {
    href: "/sommelier",
    label: "Sommelier de Cabecera",
    desc: "Consulta con AI",
    icon: IconGraduation,
  },
  {
    href: "/catalab",
    label: "Escanea tu Vino",
    desc: "Escanea etiquetas",
    icon: IconCamera,
  },
  {
    href: "/maridaje",
    label: "Maridaje",
    desc: "Cocina dominicana",
    icon: IconUtensils,
  },
  {
    href: "/vinos",
    label: "Vinos",
    desc: "Explora miles",
    icon: IconWine,
  },
  {
    href: "/bodega",
    label: "Bodega",
    desc: "Tu coleccion",
    icon: IconCellar,
  },
  {
    href: "/academia",
    label: "Academia",
    desc: "15 lecciones",
    icon: IconGraduation,
  },
] as const;

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden pb-6 pt-4 text-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, var(--radial-glow) 0%, transparent 65%)",
          }}
        />
        <div className="section-label mb-3 animate-fade-in">Bienvenidos</div>
        <h1 className="hero-title">
          El Sommelier RD
          <br />
          <em>Academy</em>
        </h1>
        <p
          className="mx-auto mt-4 max-w-sm text-sm leading-relaxed"
          style={{ color: "var(--text-dim)" }}
        >
          El primer sommelier digital dominicano. Aprende, descubre y marida con la
          sabiduria de El Maestro.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        {QUICK.map(({ href, label, desc, icon: Icon }, i) => (
          <Link
            key={href}
            href={href}
            className="glass-card group flex flex-col gap-3 p-4 transition-transform duration-300 hover:-translate-y-0.5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Icon active />
            <div>
              <div className="font-display text-lg leading-tight" style={{ color: "var(--cream)" }}>
                {label}
              </div>
              <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                {desc}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="section-label">Destacado</span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <article className="glass-card mb-3 p-4">
        <div className="section-label mb-2">Leccion del dia</div>
        <h2 className="font-display text-xl" style={{ color: "var(--cream)" }}>
          Los aromas terciarios del vino
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
          Descubre como el tiempo en barrica y botella transforma un vino y crea
          complejidad unica. Nivel Bronce - 8 min
        </p>
      </article>

      <article className="glass-card p-4">
        <div className="section-label mb-2">Maridaje de la semana</div>
        <h2 className="font-display text-xl" style={{ color: "var(--cream)" }}>
          Mofongo al ajillo con Albarino
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
          La acidez vibrante del Albarino gallego abraza el ajo y la textura del
          platano como un mar que besa la costa caribena.
        </p>
      </article>
    </div>
  );
}

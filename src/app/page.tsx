import Link from "next/link";
import { VideoHero } from "@/components/home/VideoHero";
import { HeroMediaCard } from "@/components/ui/HeroMediaCard";
import {
  IconCamera,
  IconCellar,
  IconGraduation,
  IconUtensils,
  IconWine,
} from "@/components/icons/NavIcons";

const QUICK = [
  {
    href: "/sommelier/",
    label: "Sommelier de Cabecera",
    desc: "Consulta con AI",
    icon: IconGraduation,
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    href: "/catalab/",
    label: "Escanea tu Vino",
    desc: "Escanea etiquetas",
    icon: IconCamera,
    image:
      "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80",
  },
  {
    href: "/maridaje/",
    label: "Maridaje",
    desc: "Cocina dominicana",
    icon: IconUtensils,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  },
  {
    href: "/vinos/",
    label: "Vinos",
    desc: "Explora miles",
    icon: IconWine,
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
  },
  {
    href: "/bodega/",
    label: "Bodega",
    desc: "Tu coleccion",
    icon: IconCellar,
    image:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=800&q=80",
  },
  {
    href: "/academia/",
    label: "Academia",
    desc: "15 lecciones",
    icon: IconGraduation,
    image:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export default function HomePage() {
  return (
    <div className="-mx-4 -mt-5">
      {/* Immersive video hero — first viewport */}
      <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden px-5 pb-10 pt-24">
        <VideoHero />

        <div className="relative z-10 max-w-md">
          <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--gold)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Bienvenidos
          </p>
          <h1
            className="font-display text-5xl font-light leading-[1.05] text-[#f5efe0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] sm:text-6xl"
          >
            El Sommelier{" "}
            <em className="not-italic text-[var(--gold)]">RD</em>
            <br />
            <span className="text-[0.72em] italic text-[var(--gold-light)]">Academy</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#e8dfd0]/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            El primer sommelier digital dominicano. Aprende, descubre y marida con la
            sabiduria de El Maestro.
          </p>
        </div>
      </section>

      {/* Depth gradient section */}
      <section className="relative bg-gradient-to-br from-[#0a0a0a] via-[#1a080c] to-[#0a0a0a] px-4 pb-8 pt-8">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#2a0808]/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-[#800020]/25 blur-3xl" />

        <div className="relative mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[var(--gold)]">
            Entra al templo
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK.map(({ href, label, desc, image }) => (
            <Link key={href} href={href} className="block">
              <HeroMediaCard
                as="div"
                image={image}
                title={label}
                subtitle={desc}
                tall={false}
              />
            </Link>
          ))}
        </div>

        <div className="relative my-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[var(--gold)]">
            Destacado
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="relative space-y-4">
          <HeroMediaCard
            as="div"
            image="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1000&q=80"
            badge="Leccion del dia"
            title="Los aromas terciarios del vino"
            subtitle="Nivel Bronce · 8 min"
            tall
          />
          <HeroMediaCard
            as="div"
            image="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80"
            badge="Maridaje de la semana"
            title="Mofongo al ajillo con Albarino"
            subtitle="La acidez gallega abraza el ajo y el platano"
            tall
          />
        </div>
      </section>
    </div>
  );
}

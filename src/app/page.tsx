import Link from "next/link";
import { VideoHero } from "@/components/home/VideoHero";
import { HeroMediaCard } from "@/components/ui/HeroMediaCard";
import {
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
    href: "/bodega/#escanear",
    label: "Bodega y Escaneo",
    desc: "Coleccion + etiquetas",
    icon: IconCellar,
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
    href: "/academia/",
    label: "Academia",
    desc: "Lecciones y planes",
    icon: IconGraduation,
    image:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80",
  },
  {
    href: "/videos/",
    label: "Videos",
    desc: "El templo en movimiento",
    icon: IconWine,
    image:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export default function HomePage() {
  return (
    <div className="-mx-4 -mt-5 sm:-mx-6 md:-mx-10 lg:-mx-14">
      <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden px-5 pb-10 pt-24 sm:px-8 md:px-12 lg:px-16">
        <VideoHero />

        <div className="relative z-10 w-full max-w-3xl">
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[#e0c070] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Bienvenidos
          </p>
          <h1 className="font-display text-5xl font-light leading-[1.05] text-[#f5efe0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-6xl lg:text-7xl">
            El Sommelier <em className="not-italic text-[#e0c070]">RD</em>
            <br />
            <span className="text-[0.72em] italic text-[#f0d78a]">Academy</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#f5efe0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-lg">
            El primer sommelier digital dominicano. Aprende, descubre y marida con la
            sabiduria de El Maestro.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/maridaje/"
              className="inline-flex items-center rounded-temple px-5 py-3 font-mono text-[0.7rem] uppercase tracking-wider text-[#0a0a0a] transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e0c070)" }}
            >
              Descubrir maridaje
            </Link>
            <Link
              href="/vinos/"
              className="inline-flex items-center rounded-temple border border-[#e0c070] px-5 py-3 font-mono text-[0.7rem] uppercase tracking-wider text-[#f5efe0] transition-transform hover:scale-[1.02]"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              Explorar vinos
            </Link>
            <Link
              href="/academia/"
              className="inline-flex items-center rounded-temple border border-white/35 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-wider text-[#f5efe0] transition-transform hover:scale-[1.02]"
              style={{ background: "rgba(0,0,0,0.35)" }}
            >
              Entrar a Academia
            </Link>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-[#0a0a0a] via-[#1a080c] to-[#0a0a0a] px-4 pb-8 pt-8 sm:px-8 md:px-12 lg:px-16">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#2a0808]/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-[#800020]/25 blur-3xl" />

        <div className="relative mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#e0c070]">
            Entra al templo
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK.map(({ href, label, desc, image }) => (
            <Link key={href} href={href} className="block focus:outline-none">
              <HeroMediaCard as="div" image={image} title={label} subtitle={desc} tall={false} />
            </Link>
          ))}
        </div>

        <div className="relative my-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#e0c070]">
            Destacado
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Link href="/academia/" className="block">
            <HeroMediaCard
              as="div"
              image="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1000&q=80"
              badge="Leccion del dia"
              title="Los aromas terciarios del vino"
              subtitle="Nivel Bronce · Abrir Academia"
              tall
            />
          </Link>
          <Link href="/maridaje/" className="block">
            <HeroMediaCard
              as="div"
              image="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80"
              badge="Maridaje de la semana"
              title="Mofongo al ajillo con Albarino"
              subtitle="Abrir motor de maridaje"
              tall
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

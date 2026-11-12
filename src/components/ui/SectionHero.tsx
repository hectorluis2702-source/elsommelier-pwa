import type { ReactNode } from "react";

export function SectionHero({
  greeting,
  title,
  subtitle,
}: {
  greeting: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="pb-5 pt-1 text-center">
      <div className="section-label mb-2">{greeting}</div>
      <h1 className="hero-title">{title}</h1>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

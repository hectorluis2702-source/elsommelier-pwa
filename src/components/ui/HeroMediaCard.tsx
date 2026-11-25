"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
  image: string;
  title: string;
  subtitle?: string;
  badge?: string;
  active?: boolean;
  tall?: boolean;
  onClick?: () => void;
  footer?: ReactNode;
  as?: "button" | "div";
};

export function HeroMediaCard({
  image,
  title,
  subtitle,
  badge,
  active,
  tall,
  onClick,
  footer,
  as = "button",
}: Props) {
  const className = [
    "group relative w-full overflow-hidden rounded-temple text-left transition-transform duration-300 hover:scale-[1.02]",
    tall ? "min-h-[280px]" : "min-h-[220px]",
  ].join(" ");

  const style = {
    border: `1px solid ${active ? "var(--gold)" : "rgba(255,255,255,0.1)"}`,
    boxShadow: active
      ? "0 0 0 1px var(--gold), 0 20px 50px rgba(0,0,0,0.45)"
      : "0 16px 40px rgba(0,0,0,0.35)",
  } as const;

  const body = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 0 1px rgba(201,168,76,0.55)" }}
      />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="rounded-temple-sm border border-white/10 bg-black/40 p-3 backdrop-blur-md">
          {badge ? (
            <div className="mb-1 font-mono text-[0.5rem] uppercase tracking-[0.16em] text-[var(--gold)]">
              {badge}
            </div>
          ) : null}
          <div
            className="font-display text-xl leading-tight text-[#f5efe0]"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.65)" }}
          >
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-wider text-[#c8bfa8]">
              {subtitle}
            </div>
          ) : null}
          {footer}
        </div>
      </div>
    </>
  );

  if (as === "div") {
    return (
      <div className={className} style={style} onClick={onClick} role={onClick ? "button" : undefined}>
        {body}
      </div>
    );
  }

  const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    type: "button",
    onClick,
    className,
    style,
  };

  return <button {...buttonProps}>{body}</button>;
}

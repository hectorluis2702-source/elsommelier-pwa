"use client";

import { HERO_VIDEO, HERO_VIDEO_FALLBACK, HERO_VIDEO_POSTER } from "@/lib/media";

export function VideoHero() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={HERO_VIDEO_POSTER}
        className="h-full w-full object-cover"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
        <source src={HERO_VIDEO_FALLBACK} type="video/mp4" />
      </video>
      {/* Stronger vignette for cream/champagne UI readability on overlay text */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a0808]/55 via-transparent to-[#0a0a0a]/70" />
    </div>
  );
}
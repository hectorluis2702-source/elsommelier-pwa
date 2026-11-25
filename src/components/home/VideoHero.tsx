"use client";

import { HERO_VIDEO, HERO_VIDEO_POSTER } from "@/lib/media";

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
      </video>
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a0808]/70 via-transparent to-[#0a0a0a]/80" />
    </div>
  );
}

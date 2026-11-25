"use client";

import dynamic from "next/dynamic";
import { SectionHero } from "@/components/ui/SectionHero";
import { LoadingState } from "@/components/ui/LoadingState";

const WineMap = dynamic(() => import("@/components/mapa/WineMap").then((m) => m.WineMap), {
  ssr: false,
  loading: () => <LoadingState label="Cargando cartografia..." />,
});

export default function MapaPage() {
  return (
    <div>
      <SectionHero
        greeting="Cartografia Vinicola"
        title={
          <>
            Regiones <em>del mundo</em>
          </>
        }
        subtitle="Navega Region → Zona → Vinedo. Cambia entre vista nocturna, diurna o satelite."
      />
      <WineMap />
    </div>
  );
}

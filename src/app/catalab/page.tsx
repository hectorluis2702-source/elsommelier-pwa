"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/LoadingState";

/** Escaneo fusionado en Bodega — redirige enlaces antiguos */
export default function CataLabRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/bodega/#escanear");
  }, [router]);

  return <LoadingState label="Abriendo Bodega y Escaneo..." />;
}

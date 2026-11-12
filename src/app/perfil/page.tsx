"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";

type PlanId = "bronce" | "plata" | "oro";

const PLAN_KEY = "elsommelier-plan";

const PLANS: {
  id: PlanId;
  label: string;
  price: string;
  body: string;
  accent: string;
  cta: string;
}[] = [
  {
    id: "bronce",
    label: "Bronce — Gratuito",
    price: "Plan actual",
    body: "15 lecciones - Quiz interactivos - Acceso a El Maestro AI",
    accent: "rgba(184,134,11,0.22)",
    cta: "Seleccionar Bronce",
  },
  {
    id: "plata",
    label: "Actualizar a Plata",
    price: "$9.99 / mes",
    body: "18 lecciones avanzadas - Cata Lab SAT - Bodega personal - Sin limites con El Maestro",
    accent: "rgba(184,134,11,0.4)",
    cta: "Elegir Plata",
  },
  {
    id: "oro",
    label: "Actualizar a Oro",
    price: "$29.99 / mes",
    body: "12 lecciones master - Certificacion SAT - Spider Graph avanzado - Maridaje personalizado - Soporte prioritario",
    accent: "rgba(184,134,11,0.6)",
    cta: "Elegir Oro",
  },
];

export default function PerfilPage() {
  const { showToast } = useToast();
  const [plan, setPlan] = useState<PlanId>("bronce");

  useEffect(() => {
    const stored = localStorage.getItem(PLAN_KEY) as PlanId | null;
    if (stored === "bronce" || stored === "plata" || stored === "oro") {
      setPlan(stored);
    }
  }, []);

  function selectPlan(id: PlanId) {
    setPlan(id);
    localStorage.setItem(PLAN_KEY, id);
    const labels = { bronce: "Bronce", plata: "Plata", oro: "Oro" } as const;
    showToast(
      id === "bronce"
        ? "Plan Bronce activo"
        : `Simulacion: plan ${labels[id]} seleccionado. Checkout pronto.`
    );
  }

  const nivelLabel =
    plan === "oro" ? "Nivel Oro - Master" : plan === "plata" ? "Nivel Plata - Avanzado" : "Nivel Bronce - Iniciado";

  return (
    <div>
      <div className="mb-6 flex flex-col items-center pt-4 text-center">
        <div
          className="mb-3 flex h-20 w-20 items-center justify-center rounded-full font-display text-3xl"
          style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}
        >
          S
        </div>
        <h1 className="font-display text-3xl text-[var(--cream)]">Estudiante</h1>
        <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--text-dim)]">
          {nivelLabel}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { value: "0", label: "Lecciones" },
          { value: "0", label: "XP" },
          { value: "0", label: "Racha dias" },
        ].map((s) => (
          <div key={s.label} className="rounded-temple border border-[var(--border)] bg-[#1c1414] py-4 text-center">
            <div className="font-display text-2xl text-[var(--gold)]">{s.value}</div>
            <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider text-[var(--text-dim)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--gold)]">
        Planes de suscripcion
      </div>

      <div className="space-y-3">
        {PLANS.map((p) => {
          const active = plan === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPlan(p.id)}
              className="w-full rounded-temple border p-4 text-left transition-transform duration-300 hover:scale-[1.01]"
              style={{
                borderColor: active ? "var(--gold)" : p.accent,
                background: active ? "rgba(42,8,8,0.55)" : "#1c1414",
                boxShadow: active ? "0 0 0 1px var(--gold)" : undefined,
              }}
              aria-pressed={active}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div
                    className="mb-1 font-mono text-[0.65rem] uppercase tracking-wider"
                    style={{ color: "var(--gold)" }}
                  >
                    {p.id === "bronce" ? "Plan actual base" : p.label}
                  </div>
                  <h2 className="font-display text-2xl text-[var(--cream)]">
                    {p.id === "bronce" ? p.label : p.price}
                  </h2>
                  {p.id !== "bronce" ? (
                    <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--gold-light)]">
                      {p.label}
                    </p>
                  ) : (
                    <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--text-dim)]">
                      {p.price}
                    </p>
                  )}
                  <p className="mt-2 text-base leading-relaxed text-[#d4c8b0]">{p.body}</p>
                </div>
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs"
                  style={{
                    borderColor: "var(--gold)",
                    background: active ? "var(--gold)" : "transparent",
                    color: active ? "#0a0a0a" : "var(--gold)",
                  }}
                >
                  {active ? "✓" : ""}
                </span>
              </div>
              <div
                className="mt-4 inline-flex rounded-temple-sm px-3 py-2 font-mono text-[0.65rem] uppercase tracking-wider"
                style={{
                  border: "1px solid var(--gold)",
                  color: active ? "#0a0a0a" : "var(--gold)",
                  background: active ? "var(--gold)" : "transparent",
                }}
              >
                {active ? "Plan seleccionado" : p.cta}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

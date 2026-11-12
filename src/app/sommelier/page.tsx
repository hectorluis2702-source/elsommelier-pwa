"use client";

import { useEffect, useRef, useState } from "react";
import { askSommelier } from "@/lib/api";

type Msg = { role: "user" | "maestro"; text: string };

export default function SommelierPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "maestro",
      text: "Bienvenido a mi universo. Soy tu Sommelier de Cabecera — el primer sommelier digital dominicano. Puedes preguntarme sobre vinos, maridajes con nuestra gastronomia, tecnicas de cata, o cualquier duda del mundo vinicola. En que puedo servirte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send() {
    const msg = input.trim();
    if (!msg || typing) return;

    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    const nextHistory = [...history, { role: "user", content: msg }];
    setHistory(nextHistory);
    setTyping(true);

    try {
      const data = await askSommelier(msg, nextHistory.slice(-10));
      const reply =
        data.respuesta || data.error || "El Maestro no pudo responder en este momento.";
      setMessages((m) => [...m, { role: "maestro", text: reply }]);
      setHistory((h) => [...h, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "maestro",
          text: "Hay una interrupcion en la conexion con El Maestro. Verifica el backend y vuelve a intentar.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col">
      <div className="glass-card mb-4 flex items-center gap-3 p-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full font-display text-xl"
          style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}
        >
          M
        </div>
        <div>
          <h1 className="font-display text-lg" style={{ color: "var(--cream)" }}>
            El Sommelier de Cabecera
          </h1>
          <p className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
            Cerebro-Elsommelier-RD - Siempre disponible
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[92%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
          >
            <div className="mb-1 font-mono text-[0.5rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
              {m.role === "user" ? "Tu" : "El Maestro"}
            </div>
            <div
              className="rounded-temple px-3.5 py-2.5 text-sm leading-relaxed"
              style={{
                background: m.role === "user" ? "var(--burgundy)" : "var(--glass-bg)",
                border: "1px solid var(--border)",
                color: "var(--cream)",
              }}
            >
              {m.text.split("\n").map((line, li) => (
                <span key={li}>
                  {line}
                  {li < m.text.split("\n").length - 1 ? <br /> : null}
                </span>
              ))}
            </div>
          </div>
        ))}
        {typing ? (
          <div className="mr-auto max-w-[92%]">
            <div className="mb-1 font-mono text-[0.5rem] uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
              El Maestro
            </div>
            <div
              className="flex gap-1 rounded-temple px-4 py-3"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--border)" }}
            >
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full" style={{ background: "var(--gold)" }} />
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full [animation-delay:0.2s]" style={{ background: "var(--gold)" }} />
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full [animation-delay:0.4s]" style={{ background: "var(--gold)" }} />
            </div>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-24 flex gap-2 pt-2" style={{ background: "var(--bg)" }}>
        <textarea
          ref={taRef}
          className="input-temple max-h-[120px] min-h-[48px] resize-none"
          placeholder="Pregunta al Maestro..."
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button
          type="button"
          onClick={send}
          disabled={typing}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-temple"
          style={{
            background: "linear-gradient(135deg, var(--burgundy), var(--burgundy-light))",
            border: "1px solid var(--gold)",
            color: "var(--cream)",
          }}
          aria-label="Enviar"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

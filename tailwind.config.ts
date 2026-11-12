import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        temple: {
          bg: "var(--bg)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)",
          burgundy: "var(--burgundy)",
          "burgundy-light": "var(--burgundy-light)",
          gold: "var(--gold)",
          "gold-light": "var(--gold-light)",
          cream: "var(--cream)",
          "cream-dim": "var(--cream-dim)",
          text: "var(--text)",
          muted: "var(--text-dim)",
          border: "var(--border)",
          "border-hover": "var(--border-hover)",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        temple: "12px",
        "temple-sm": "8px",
      },
      boxShadow: {
        temple: "var(--shadow)",
        glass: "var(--glass-shadow)",
      },
      backgroundImage: {
        "radial-burgundy":
          "radial-gradient(ellipse at 30% 20%, var(--radial-glow) 0%, transparent 55%)",
        "radial-chardonnay":
          "radial-gradient(ellipse at 70% 10%, var(--radial-glow) 0%, transparent 50%)",
      },
      keyframes: {
        sectionIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
        expand: {
          from: { width: "0", opacity: "0" },
          to: { width: "120px", opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        shelfReveal: {
          from: { opacity: "0", transform: "translateY(16px) scale(0.96)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "section-in": "sectionIn 0.35s ease",
        "fade-in": "fadeIn 1.2s ease forwards",
        expand: "expand 2s ease 0.5s both",
        "pulse-dot": "pulseDot 2s infinite",
        "shelf-reveal": "shelfReveal 0.45s ease both",
      },
    },
  },
  plugins: [],
};

export default config;

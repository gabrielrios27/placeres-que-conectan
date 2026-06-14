/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Tokens fijos de marca (§3.1) ──
        oliva: {
          900: "#2F3B17",
          700: "#4A5A2B",
          500: "#6B7F3A",
          300: "#9CAA6B",
        },
        terra: {
          700: "#9E4A22",
          500: "#C0622D",
          300: "#DE8B5C",
        },
        ambar: {
          600: "#C8902E",
          400: "#E2B25A",
          200: "#F1D08A",
        },
        crema: {
          50: "#FBF3E2",
          100: "#F6E8CC",
          200: "#EFD9B0",
        },
        cacao: {
          900: "#2C1E14",
          700: "#4A3526",
        },
        // ── Tokens dinámicos de tema (resueltos por useTema en :root) ──
        tbg: "var(--bg)",
        "tbg-2": "var(--bg-2)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        tborder: "var(--border)",
        ttext: "var(--text)",
        "ttext-soft": "var(--text-soft)",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        "accent-2": "var(--accent-2)",
        "on-accent": "var(--on-accent)",
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        calida: "0 20px 40px -15px var(--shadow)",
        "calida-sm": "0 8px 20px -10px var(--shadow)",
        "calida-lg": "0 30px 60px -20px var(--shadow)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flotar: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulso: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s ease forwards",
        flotar: "flotar 6s ease-in-out infinite",
        pulso: "pulso .4s ease",
      },
    },
  },
  plugins: [],
};

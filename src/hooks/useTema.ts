import { useCallback, useEffect, useState } from "react";
import {
  estacionActual,
  franjaHoraria,
  type Estacion,
  type Franja,
} from "../lib/estacion";
import { resolverTema, type Paleta } from "../lib/temas";

export type PrefTema = "claro" | "oscuro" | "auto";
const STORAGE_KEY = "tema_pref";

// ── contraste WCAG, para elegir el texto legible sobre el acento ──
function canalLineal(v: number): number {
  const x = v / 255;
  return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}
function luminancia(hex: string): number {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return 0.2126 * canalLineal(r) + 0.7152 * canalLineal(g) + 0.0722 * canalLineal(b);
}
function contraste(a: string, b: string): number {
  const l1 = luminancia(a);
  const l2 = luminancia(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
/** Devuelve blanco o casi-negro: el que más contraste tenga sobre el acento. */
function textoSobre(accent: string): string {
  const oscuro = "#241A12";
  return contraste(accent, "#FFFFFF") >= contraste(accent, oscuro) ? "#FFFFFF" : oscuro;
}

function aplicarPaleta(p: Paleta) {
  const r = document.documentElement;
  r.style.setProperty("--on-accent", textoSobre(p.accent));
  r.style.setProperty("--on-accent-strong", textoSobre(p.accentStrong));
  r.style.setProperty("--bg", p.bg);
  r.style.setProperty("--bg-2", p.bg2);
  r.style.setProperty("--surface", p.surface);
  r.style.setProperty("--surface-2", p.surface2);
  r.style.setProperty("--border", p.border);
  r.style.setProperty("--text", p.text);
  r.style.setProperty("--text-soft", p.textSoft);
  r.style.setProperty("--accent", p.accent);
  r.style.setProperty("--accent-strong", p.accentStrong);
  r.style.setProperty("--accent-2", p.accent2);
  r.style.setProperty("--shadow", p.shadow);
  r.style.setProperty("--particle", p.particle);
  r.style.setProperty("--glow", p.glow);
  r.dataset.theme = p.dark ? "dark" : "light";
  r.style.colorScheme = p.dark ? "dark" : "light";
}

function leerPref(): PrefTema {
  if (typeof window === "undefined") return "auto";
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "claro" || v === "oscuro" || v === "auto") return v;
  return "auto";
}

/** Override opcional por URL para previsualizar/auditar temas:
 *  ?franja=noche&estacion=otono  (solo activo si ambos parámetros existen). */
function leerOverride(): { franja: Franja; estacion: Estacion } | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const f = p.get("franja") as Franja | null;
  const e = p.get("estacion") as Estacion | null;
  const franjas: Franja[] = ["amanecer", "dia", "atardecer", "noche"];
  const estaciones: Estacion[] = ["verano", "otono", "invierno", "primavera"];
  if (f && e && franjas.includes(f) && estaciones.includes(e)) {
    return { franja: f, estacion: e };
  }
  return null;
}

/**
 * Resuelve la franja efectiva según la preferencia:
 *  - "claro"  → franja "dia" de la estación actual
 *  - "oscuro" → franja "noche" de la estación actual
 *  - "auto"   → franja real por hora; pero si el sistema prefiere oscuro
 *               y ya es de tarde/noche, se respeta esa intención.
 */
function franjaEfectiva(pref: PrefTema): Franja {
  if (pref === "claro") return "dia";
  if (pref === "oscuro") return "noche";
  // auto
  const franja = franjaHoraria();
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches &&
    (franja === "atardecer" || franja === "noche")
  ) {
    return "noche";
  }
  return franja;
}

export interface EstadoTema {
  pref: PrefTema;
  setPref: (p: PrefTema) => void;
  franja: Franja;
  estacion: Estacion;
  dark: boolean;
  paleta: Paleta;
}

export function useTema(): EstadoTema {
  const override = leerOverride();
  const [pref, setPrefState] = useState<PrefTema>(leerPref);
  const [estacion, setEstacion] = useState<Estacion>(
    () => override?.estacion ?? estacionActual()
  );
  const [franja, setFranja] = useState<Franja>(
    () => override?.franja ?? franjaEfectiva(leerPref())
  );

  const recalcular = useCallback((p: PrefTema) => {
    const ov = leerOverride();
    if (ov) {
      setEstacion(ov.estacion);
      setFranja(ov.franja);
      return;
    }
    setEstacion(estacionActual());
    setFranja(franjaEfectiva(p));
  }, []);

  // Aplica la paleta cada vez que cambia franja o estación.
  useEffect(() => {
    aplicarPaleta(resolverTema(franja, estacion));
  }, [franja, estacion]);

  // Re-evalúa cada 10 min por si pasa de día a noche con la pestaña abierta.
  useEffect(() => {
    const id = window.setInterval(() => recalcular(pref), 10 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [pref, recalcular]);

  // Reacciona a cambios del esquema de color del sistema (solo en auto).
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const handler = () => {
      if (pref === "auto") recalcular("auto");
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [pref, recalcular]);

  const setPref = useCallback(
    (p: PrefTema) => {
      setPrefState(p);
      try {
        window.localStorage.setItem(STORAGE_KEY, p);
      } catch {
        /* ignore */
      }
      recalcular(p);
    },
    [recalcular]
  );

  return {
    pref,
    setPref,
    franja,
    estacion,
    dark: resolverTema(franja, estacion).dark,
    paleta: resolverTema(franja, estacion),
  };
}

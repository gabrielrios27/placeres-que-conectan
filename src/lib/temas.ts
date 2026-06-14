import type { Franja, Estacion } from "./estacion";

export interface Paleta {
  dark: boolean; // true en los temas de noche (logo/íconos claros)
  bg: string; // fondo principal
  bg2: string; // segundo stop del gradiente de fondo
  surface: string; // tarjetas / paneles
  surface2: string; // hover / superficie elevada
  border: string; // bordes sutiles
  text: string; // texto principal
  textSoft: string; // texto secundario
  accent: string; // acento principal (botones, precios, foco)
  accentStrong: string; // estado hover / pressed del acento
  accent2: string; // acento secundario (chips, decoración)
  shadow: string; // color de sombra (rgba)
  particle: string; // color de las partículas ambientales de la estación
  glow: string; // resplandor del acento (solo noche; "none" en claros)
}

export const TEMAS: Record<Franja, Record<Estacion, Paleta>> = {
  // ───────────────────────── DÍA (luminoso, fondos crema claros) ─────────────────────────
  dia: {
    verano: { dark: false, bg: "#FBF3E2", bg2: "#F6E8CC", surface: "#FFFDF8", surface2: "#FBF1DC", border: "#E7D6B5", text: "#2C1E14", textSoft: "#6B5848", accent: "#C8902E", accentStrong: "#A9761F", accent2: "#C0622D", shadow: "rgba(74,53,38,.16)", particle: "#E2B25A", glow: "none" },
    otono: { dark: false, bg: "#F7ECD7", bg2: "#F0DEC0", surface: "#FFFCF4", surface2: "#F8EEDA", border: "#E6D1AE", text: "#2C1E14", textSoft: "#6E5742", accent: "#B5562A", accentStrong: "#94431F", accent2: "#C8902E", shadow: "rgba(74,53,38,.16)", particle: "#C77B3A", glow: "none" },
    invierno: { dark: false, bg: "#F2ECDD", bg2: "#E7E0CE", surface: "#FBF8F0", surface2: "#F0EBDC", border: "#DAD2BE", text: "#28231B", textSoft: "#5E5848", accent: "#4A5A2B", accentStrong: "#394717", accent2: "#6B7F3A", shadow: "rgba(40,35,27,.16)", particle: "#C9CBB6", glow: "none" },
    primavera: { dark: false, bg: "#F6F2E0", bg2: "#ECEFCF", surface: "#FEFEF6", surface2: "#F4F4E2", border: "#DEE0BE", text: "#2C2E18", textSoft: "#5F6347", accent: "#6B7F3A", accentStrong: "#556B2F", accent2: "#E2B25A", shadow: "rgba(44,46,24,.16)", particle: "#B7C77F", glow: "none" },
  },
  // ──────────────────────── AMANECER (claro, cálido, tinte durazno) ───────────────────────
  amanecer: {
    verano: { dark: false, bg: "#FBEBD2", bg2: "#F8DEBC", surface: "#FFF8EC", surface2: "#FBEED6", border: "#EFD9B8", text: "#3A2818", textSoft: "#7A6048", accent: "#D99A3A", accentStrong: "#BC7E22", accent2: "#E08A4E", shadow: "rgba(74,53,38,.16)", particle: "#F1D08A", glow: "none" },
    otono: { dark: false, bg: "#F8E6CC", bg2: "#F2D6B2", surface: "#FFF6E8", surface2: "#F9ECD4", border: "#ECD0AC", text: "#3A2818", textSoft: "#7A5E44", accent: "#C76A33", accentStrong: "#A4521F", accent2: "#D9A441", shadow: "rgba(74,53,38,.16)", particle: "#D98E52", glow: "none" },
    invierno: { dark: false, bg: "#EFE8D6", bg2: "#E4DAC2", surface: "#FAF5EA", surface2: "#EFE8D6", border: "#DCD2BC", text: "#322B20", textSoft: "#685F4C", accent: "#5A6B33", accentStrong: "#45561F", accent2: "#8A9A5B", shadow: "rgba(40,35,27,.16)", particle: "#CFD0BA", glow: "none" },
    primavera: { dark: false, bg: "#F4EDD4", bg2: "#ECE9C8", surface: "#FDFBEF", surface2: "#F4F0DE", border: "#DFDDBA", text: "#322E1C", textSoft: "#62614A", accent: "#7C9043", accentStrong: "#647734", accent2: "#E6B85E", shadow: "rgba(44,46,24,.16)", particle: "#C2CF88", glow: "none" },
  },
  // ──────────────────── ATARDECER (medio, dorado/terracota más profundo) ──────────────────
  atardecer: {
    verano: { dark: false, bg: "#F4E2C2", bg2: "#EDCF9E", surface: "#FBF0DA", surface2: "#F4E4C6", border: "#E5CBA0", text: "#3A2614", textSoft: "#7C5C3C", accent: "#C77A1E", accentStrong: "#A35F12", accent2: "#B5562A", shadow: "rgba(74,53,38,.22)", particle: "#E8A94A", glow: "none" },
    otono: { dark: false, bg: "#F0D9B6", bg2: "#E6C193", surface: "#F9EBD0", surface2: "#F0DCBA", border: "#E0C195", text: "#3A2412", textSoft: "#7A553A", accent: "#A8481F", accentStrong: "#863613", accent2: "#C8902E", shadow: "rgba(58,36,18,.22)", particle: "#CE7434", glow: "none" },
    invierno: { dark: false, bg: "#E8DEC6", bg2: "#DACFB2", surface: "#F5EEDD", surface2: "#E9E1CC", border: "#D6CAB0", text: "#332A1D", textSoft: "#665C49", accent: "#556B2F", accentStrong: "#41541F", accent2: "#9E5A2A", shadow: "rgba(40,35,27,.22)", particle: "#C6C4AC", glow: "none" },
    primavera: { dark: false, bg: "#F0E6C6", bg2: "#E8E0B8", surface: "#FAF4E0", surface2: "#F0E8CE", border: "#DCD6AE", text: "#332E1A", textSoft: "#635E44", accent: "#6E8438", accentStrong: "#586C2B", accent2: "#D99A3A", shadow: "rgba(44,46,24,.22)", particle: "#BDC97E", glow: "none" },
  },
  // ──────────────── NOCHE (oscuro, espresso cálido, acentos que "brillan") ─────────────────
  noche: {
    verano: { dark: true, bg: "#1E1610", bg2: "#2A1E14", surface: "#2C2118", surface2: "#392A1D", border: "#3C2C1E", text: "#F4E7D2", textSoft: "#BBA384", accent: "#E2B25A", accentStrong: "#F1D08A", accent2: "#D98A4E", shadow: "rgba(0,0,0,.5)", particle: "#E2B25A", glow: "rgba(226,178,90,.35)" },
    otono: { dark: true, bg: "#1F1610", bg2: "#2B1C12", surface: "#2E2016", surface2: "#3C2A1B", border: "#3E2C1C", text: "#F3E5CE", textSoft: "#BBA083", accent: "#D98A4E", accentStrong: "#E8A45E", accent2: "#C8902E", shadow: "rgba(0,0,0,.5)", particle: "#D98A4E", glow: "rgba(217,138,78,.32)" },
    invierno: { dark: true, bg: "#16170F", bg2: "#1F2116", surface: "#232619", surface2: "#2F3322", border: "#313524", text: "#ECEAD6", textSoft: "#A8AC8E", accent: "#8A9A5B", accentStrong: "#A6B576", accent2: "#C8902E", shadow: "rgba(0,0,0,.5)", particle: "#A8AC8E", glow: "rgba(138,154,91,.28)" },
    primavera: { dark: true, bg: "#181A0F", bg2: "#212414", surface: "#252818", surface2: "#313723", border: "#333823", text: "#EFEDD6", textSoft: "#ADB18F", accent: "#9CAA6B", accentStrong: "#BAC788", accent2: "#E2B25A", shadow: "rgba(0,0,0,.5)", particle: "#9CAA6B", glow: "rgba(156,170,107,.3)" },
  },
};

export function resolverTema(franja: Franja, estacion: Estacion): Paleta {
  return TEMAS[franja][estacion];
}

export type Estacion = "verano" | "otono" | "invierno" | "primavera";

// Hemisferio sur (Argentina). Aproximación por mes, suficiente para el theming.
export function estacionActual(fecha = new Date()): Estacion {
  const m = fecha.getMonth(); // 0 = enero ... 11 = diciembre
  if (m === 11 || m === 0 || m === 1) return "verano"; // dic, ene, feb
  if (m >= 2 && m <= 4) return "otono"; // mar, abr, may
  if (m >= 5 && m <= 7) return "invierno"; // jun, jul, ago
  return "primavera"; // sep, oct, nov
}

export type Franja = "amanecer" | "dia" | "atardecer" | "noche";

export function franjaHoraria(fecha = new Date()): Franja {
  const h = fecha.getHours();
  if (h >= 6 && h < 9) return "amanecer";
  if (h >= 9 && h < 18) return "dia";
  if (h >= 18 && h < 21) return "atardecer";
  return "noche";
}

export const NOMBRE_ESTACION: Record<Estacion, string> = {
  verano: "Verano",
  otono: "Otoño",
  invierno: "Invierno",
  primavera: "Primavera",
};

export const NOMBRE_FRANJA: Record<Franja, string> = {
  amanecer: "Amanecer",
  dia: "Día",
  atardecer: "Atardecer",
  noche: "Noche",
};

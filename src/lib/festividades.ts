/**
 * Festividades argentinas para la "capa festiva" del sitio.
 * Cada festividad se activa ANTICIPACION_DIAS antes y se apaga al terminar su día.
 * Las fechas variables (3er domingo, Pascua) se calculan por año.
 */

export type IconoFestivo =
  | "regalo"
  | "mono"
  | "corazon"
  | "estrella"
  | "flor"
  | "arbol"
  | "corona"
  | "huevo"
  | "chispa";

export interface Festividad {
  id: string;
  nombre: string;
  emoji: string;
  titulo: string;
  mensaje: string;
  cta: string;
  ctaHref: string;
  icono: IconoFestivo;
  motif: string; // color decorativo festivo (no toca el tema)
  motif2: string;
  fecha: (anio: number) => Date; // fecha del día festivo en ese año
}

export const ANTICIPACION_DIAS = 28; // 4 semanas antes

const DIA_MS = 86_400_000;

/** N-ésimo domingo de un mes (mes 0-based). */
function domingoN(anio: number, mes: number, n: number): Date {
  const primero = new Date(anio, mes, 1);
  const offset = (7 - primero.getDay()) % 7; // días hasta el 1er domingo
  return new Date(anio, mes, 1 + offset + (n - 1) * 7);
}

/** Domingo de Pascua (algoritmo de Meeus/Gauss). */
function pascua(anio: number): Date {
  const a = anio % 19;
  const b = Math.floor(anio / 100);
  const c = anio % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(anio, mes - 1, dia);
}

const fija = (mes: number, dia: number) => (anio: number) => new Date(anio, mes, dia);

export const FESTIVIDADES: Festividad[] = [
  {
    id: "mujer",
    nombre: "Día de la Mujer",
    emoji: "🌷",
    titulo: "Día de la Mujer",
    mensaje: "Celebrá a esas mujeres especiales con un detalle sabroso de San Juan.",
    cta: "Ver productos",
    ctaHref: "#calculadora",
    icono: "flor",
    motif: "#8E44AD",
    motif2: "#C39BD3",
    fecha: fija(2, 8), // 8 de marzo
  },
  {
    id: "enamorados",
    nombre: "Día de los Enamorados",
    emoji: "❤️",
    titulo: "Día de los Enamorados",
    mensaje: "Sorprendé a quien querés con un regalo con sabor de la tierra.",
    cta: "Armar el regalo ❤️",
    ctaHref: "#calculadora",
    icono: "corazon",
    motif: "#C0392B",
    motif2: "#E8718D",
    fecha: fija(1, 14), // 14 de febrero
  },
  {
    id: "pascua",
    nombre: "Pascuas",
    emoji: "🐣",
    titulo: "Pascuas",
    mensaje: "Endulzá las Pascuas con dulces y mermeladas artesanales de San Juan.",
    cta: "Ver dulces",
    ctaHref: "#calculadora",
    icono: "huevo",
    motif: "#7FB069",
    motif2: "#F2C14E",
    fecha: pascua,
  },
  {
    id: "padre",
    nombre: "Día del Padre",
    emoji: "🎁",
    titulo: "¡Se viene el Día del Padre!",
    mensaje:
      "Regalale a papá los sabores de San Juan. Armá un paquete especial y sorprendelo.",
    cta: "Armar su regalo 🎁",
    ctaHref: "#calculadora",
    icono: "regalo",
    motif: "#2E6E8E",
    motif2: "#6FB3D2",
    fecha: (a) => domingoN(a, 5, 3), // 3er domingo de junio
  },
  {
    id: "amigo",
    nombre: "Día del Amigo",
    emoji: "🥂",
    titulo: "Día del Amigo",
    mensaje: "Reuní la mesa: aceitunas, aceite y dulces para compartir con amigos.",
    cta: "Armar mi paquete",
    ctaHref: "#calculadora",
    icono: "estrella",
    motif: "#F2994A",
    motif2: "#F2C14E",
    fecha: fija(6, 20), // 20 de julio
  },
  {
    id: "nino",
    nombre: "Día del Niño",
    emoji: "🧸",
    titulo: "Día del Niño",
    mensaje: "Un dulce gesto para los más chicos. Sumá dulces y mermeladas a tu paquete.",
    cta: "Ver dulces 🍯",
    ctaHref: "#calculadora",
    icono: "estrella",
    motif: "#2D9CDB",
    motif2: "#F2994A",
    fecha: (a) => domingoN(a, 7, 3), // 3er domingo de agosto
  },
  {
    id: "madre",
    nombre: "Día de la Madre",
    emoji: "💐",
    titulo: "¡Se acerca el Día de la Madre!",
    mensaje:
      "El mejor regalo para mamá: un paquete de delicias regionales hecho con cariño.",
    cta: "Armar su regalo 💐",
    ctaHref: "#calculadora",
    icono: "flor",
    motif: "#D6477E",
    motif2: "#F4A6C0",
    fecha: (a) => domingoN(a, 9, 3), // 3er domingo de octubre
  },
  {
    id: "navidad",
    nombre: "Navidad",
    emoji: "🎄",
    titulo: "¡Llega la Navidad!",
    mensaje:
      "Regalos y mesas navideñas con lo mejor de San Juan. Armá tus cajas para regalar.",
    cta: "Armar mi caja 🎁",
    ctaHref: "#calculadora",
    icono: "arbol",
    motif: "#1B7A3D",
    motif2: "#C0392B",
    fecha: fija(11, 25), // 25 de diciembre
  },
  {
    id: "anionuevo",
    nombre: "Año Nuevo",
    emoji: "✨",
    titulo: "¡Feliz Año Nuevo!",
    mensaje: "Brindá con sabores de la tierra. Sumá productos para tu mesa de fin de año.",
    cta: "Armar mi paquete ✨",
    ctaHref: "#calculadora",
    icono: "chispa",
    motif: "#C8902E",
    motif2: "#E2B25A",
    fecha: fija(0, 1), // 1 de enero
  },
  {
    id: "reyes",
    nombre: "Reyes Magos",
    emoji: "👑",
    titulo: "Llegan los Reyes Magos",
    mensaje:
      "Un regalo con tradición para el 6 de enero. Sorprendé con delicias regionales.",
    cta: "Armar el regalo 👑",
    ctaHref: "#calculadora",
    icono: "corona",
    motif: "#6C3FA8",
    motif2: "#C8902E",
    fecha: fija(0, 6), // 6 de enero
  },
];

export interface FestividadActiva {
  fest: Festividad;
  fecha: Date;
  dias: number; // días restantes hasta el día festivo (0 = hoy)
}

function finDelDia(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
function inicioDelDia(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Devuelve la festividad activa (si la hay): aquella cuya ventana
 * [día - ANTICIPACION_DIAS, fin del día festivo] contiene a `ahora`.
 * Si hay varias activas, elige la de fecha más próxima.
 */
export function festividadActiva(ahora = new Date()): FestividadActiva | null {
  const anios = [ahora.getFullYear() - 1, ahora.getFullYear(), ahora.getFullYear() + 1];
  const activas: FestividadActiva[] = [];

  for (const fest of FESTIVIDADES) {
    for (const anio of anios) {
      const fecha = fest.fecha(anio);
      const inicio = new Date(inicioDelDia(fecha).getTime() - ANTICIPACION_DIAS * DIA_MS);
      const fin = finDelDia(fecha);
      if (ahora >= inicio && ahora <= fin) {
        const dias = Math.max(
          0,
          Math.ceil((inicioDelDia(fecha).getTime() - inicioDelDia(ahora).getTime()) / DIA_MS)
        );
        activas.push({ fest, fecha, dias });
      }
    }
  }

  if (activas.length === 0) return null;
  activas.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  // la más próxima cuyo día aún no terminó
  return activas.find((a) => finDelDia(a.fecha) >= ahora) ?? activas[0];
}

export function textoCuenta(dias: number): string {
  if (dias <= 0) return "¡Hoy es el día!";
  if (dias === 1) return "¡Es mañana!";
  if (dias === 7) return "¡Falta 1 semana!";
  return `Faltan ${dias} días`;
}

/** Override por URL para previsualizar: ?festividad=padre  ó  ?festividad=none */
export function festividadOverride(): FestividadActiva | null | undefined {
  if (typeof window === "undefined") return undefined;
  const id = new URLSearchParams(window.location.search).get("festividad");
  if (!id) return undefined;
  if (id === "none") return null;
  const fest = FESTIVIDADES.find((f) => f.id === id);
  if (!fest) return undefined;
  const anio = new Date().getFullYear();
  const fecha = fest.fecha(anio);
  const dias = Math.max(
    0,
    Math.ceil((inicioDelDia(fecha).getTime() - inicioDelDia(new Date()).getTime()) / DIA_MS)
  );
  return { fest, fecha, dias };
}

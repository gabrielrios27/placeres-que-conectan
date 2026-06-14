export type Categoria =
  | "Aceite de Oliva"
  | "Aceto"
  | "Aceituna Verde"
  | "Aceituna Negra"
  | "Dulces";

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number; // ARS
  imagen: string; // ruta en /public/productos/*.png
  destacado?: boolean;
}

export const PRODUCTOS: Producto[] = [
  // ── Aceite de Oliva Virgen Extra ──
  { id: "aceite-250", nombre: "Aceite de Oliva Virgen Extra 250 cc. Blend", categoria: "Aceite de Oliva", precio: 5800, imagen: "/productos/aceite-oliva-250.png", destacado: true },
  { id: "aceite-500", nombre: "Aceite de Oliva Virgen Extra 500 cc. Blend", categoria: "Aceite de Oliva", precio: 10100, imagen: "/productos/aceite-oliva-500.png" },
  { id: "aceite-750", nombre: "Aceite de Oliva Virgen Extra 750 cc. Blend", categoria: "Aceite de Oliva", precio: 14000, imagen: "/productos/aceite-oliva-750.png", destacado: true },
  { id: "aceite-5l", nombre: "Aceite de Oliva Virgen Extra 5 L Blend", categoria: "Aceite de Oliva", precio: 79500, imagen: "/productos/aceite-oliva-5000.png" },

  // ── Aceto ──
  { id: "aceto-250", nombre: "Aceto Balsámico 250 cc.", categoria: "Aceto", precio: 6300, imagen: "/productos/aceto-balsamico-250.png" },

  // ── Aceituna Verde (Grupo C) ──
  { id: "verde-500", nombre: "Aceituna Verde Grupo C 500 gr.", categoria: "Aceituna Verde", precio: 4100, imagen: "/productos/aceituna-verde-500.png" },
  { id: "verde-1000", nombre: "Aceituna Verde Grupo C 1 kg.", categoria: "Aceituna Verde", precio: 6500, imagen: "/productos/aceituna-verde-1000.png" },

  // ── Aceituna Negra (Griega) ──
  { id: "griega-500", nombre: "Aceituna Griega 500 gr.", categoria: "Aceituna Negra", precio: 6700, imagen: "/productos/aceituna-griega-500.png" },
  { id: "griega-1000", nombre: "Aceituna Griega 1 kg.", categoria: "Aceituna Negra", precio: 11780, imagen: "/productos/aceituna-griega-1000.png" },

  // ── Dulces y Mermeladas ──
  { id: "merm-alcayota", nombre: "Mermelada 450 gr. Alcayota", categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-alcayota.png" },
  { id: "merm-higo", nombre: "Mermelada 450 gr. Higo", categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-higo.png" },
  { id: "merm-durazno", nombre: "Mermelada 450 gr. Durazno", categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-durazno.png" },
  { id: "merm-membrillo", nombre: "Mermelada 450 gr. Membrillo", categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-membrillo.png" },
  { id: "merm-pera", nombre: "Mermelada 450 gr. Pera", categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-pera.png" },
  { id: "merm-naranja", nombre: "Mermelada 450 gr. Naranja", categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-naranja.png" },
  { id: "merm-tomate", nombre: "Mermelada 450 gr. Tomate", categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-tomate.png" },
  { id: "dulce-batatita", nombre: "Dulce 490 gr. Batatita en Almíbar", categoria: "Dulces", precio: 4300, imagen: "/productos/dulce-batatita.png" },
  { id: "dulce-naranja", nombre: "Dulce 490 gr. Naranja en Almíbar", categoria: "Dulces", precio: 4300, imagen: "/productos/dulce-naranja.png" },
  { id: "dulce-zapallito", nombre: "Dulce 490 gr. Zapallito en Almíbar", categoria: "Dulces", precio: 4300, imagen: "/productos/dulce-zapallito.png" },
  { id: "dulce-membrillo-pan", nombre: "Dulce 600 gr. Membrillo en Pan", categoria: "Dulces", precio: 4300, imagen: "/productos/dulce-membrillo-pan.png" },
];

export const formatoARS = (n: number) =>
  n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

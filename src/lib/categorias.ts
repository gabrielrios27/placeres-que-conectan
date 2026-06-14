import type { Categoria } from "../data/productos";

export interface EstiloCategoria {
  color: string; // color base de la categoría
  emoji: string;
}

// Colores ajustados para que el texto blanco del chip cumpla contraste AA (≥4.5).
export const ESTILO_CATEGORIA: Record<Categoria, EstiloCategoria> = {
  "Aceite de Oliva": { color: "#566B2C", emoji: "🫒" },
  Aceto: { color: "#8E3B5E", emoji: "🍇" },
  "Aceituna Verde": { color: "#65722F", emoji: "🟢" },
  "Aceituna Negra": { color: "#5A4632", emoji: "⚫" },
  Dulces: { color: "#9C631A", emoji: "🍯" },
};

/** Filtros de la calculadora (§7.1). "Todos" + las 5 categorías. */
export const FILTROS: { etiqueta: string; valor: Categoria | "Todos" }[] = [
  { etiqueta: "Todos", valor: "Todos" },
  { etiqueta: "Aceites", valor: "Aceite de Oliva" },
  { etiqueta: "Aceto", valor: "Aceto" },
  { etiqueta: "Aceitunas verdes", valor: "Aceituna Verde" },
  { etiqueta: "Aceitunas negras", valor: "Aceituna Negra" },
  { etiqueta: "Dulces", valor: "Dulces" },
];

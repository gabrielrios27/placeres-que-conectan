import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { PRODUCTOS, type Producto } from "../data/productos";

const STORAGE_KEY = "paquete_v1";

/** Mapa id → cantidad */
type Estado = Record<string, number>;

type Accion =
  | { tipo: "agregar"; id: string }
  | { tipo: "quitar"; id: string }
  | { tipo: "set"; id: string; cantidad: number }
  | { tipo: "vaciar" }
  | { tipo: "hidratar"; estado: Estado };

function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "agregar": {
      const actual = estado[accion.id] ?? 0;
      return { ...estado, [accion.id]: actual + 1 };
    }
    case "quitar": {
      const actual = estado[accion.id] ?? 0;
      if (actual <= 1) {
        const copia = { ...estado };
        delete copia[accion.id];
        return copia;
      }
      return { ...estado, [accion.id]: actual - 1 };
    }
    case "set": {
      if (accion.cantidad <= 0) {
        const copia = { ...estado };
        delete copia[accion.id];
        return copia;
      }
      return { ...estado, [accion.id]: accion.cantidad };
    }
    case "vaciar":
      return {};
    case "hidratar":
      return accion.estado;
    default:
      return estado;
  }
}

export interface ItemPaquete {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface PaqueteContexto {
  cantidades: Estado;
  items: ItemPaquete[];
  total: number;
  cantidadTotal: number;
  cantidadDe: (id: string) => number;
  agregar: (id: string) => void;
  quitar: (id: string) => void;
  setCantidad: (id: string, cantidad: number) => void;
  vaciar: () => void;
}

const Ctx = createContext<PaqueteContexto | null>(null);

function leerInicial(): Estado {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Estado;
    // Filtra ids que ya no existen en el catálogo.
    const validos: Estado = {};
    for (const p of PRODUCTOS) {
      if (parsed[p.id] && parsed[p.id] > 0) validos[p.id] = parsed[p.id];
    }
    return validos;
  } catch {
    return {};
  }
}

export function PaqueteProvider({ children }: { children: ReactNode }) {
  const [cantidades, dispatch] = useReducer(reducer, {}, leerInicial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cantidades));
    } catch {
      /* almacenamiento no disponible: se ignora */
    }
  }, [cantidades]);

  const valor = useMemo<PaqueteContexto>(() => {
    const items: ItemPaquete[] = PRODUCTOS.filter(
      (p) => (cantidades[p.id] ?? 0) > 0
    ).map((producto) => {
      const cantidad = cantidades[producto.id];
      return { producto, cantidad, subtotal: cantidad * producto.precio };
    });

    const total = items.reduce((acc, i) => acc + i.subtotal, 0);
    const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

    return {
      cantidades,
      items,
      total,
      cantidadTotal,
      cantidadDe: (id: string) => cantidades[id] ?? 0,
      agregar: (id: string) => dispatch({ tipo: "agregar", id }),
      quitar: (id: string) => dispatch({ tipo: "quitar", id }),
      setCantidad: (id: string, cantidad: number) =>
        dispatch({ tipo: "set", id, cantidad }),
      vaciar: () => dispatch({ tipo: "vaciar" }),
    };
  }, [cantidades]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function usePaquete(): PaqueteContexto {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePaquete debe usarse dentro de <PaqueteProvider>");
  return ctx;
}

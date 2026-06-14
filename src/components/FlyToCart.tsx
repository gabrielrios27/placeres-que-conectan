import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Producto } from "../data/productos";
import ProductoImagen from "./ProductoImagen";

interface Vuelo {
  id: string;
  producto: Producto;
  from: DOMRect;
  dx: number;
  dy: number;
}

interface FlyCtx {
  volar: (producto: Producto, from: DOMRect) => void;
}

const Ctx = createContext<FlyCtx | null>(null);

function pulsarDestino(target: HTMLElement) {
  target.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.18)" },
      { transform: "scale(1)" },
    ],
    { duration: 360, easing: "cubic-bezier(.34,1.56,.64,1)" }
  );
}

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const reduce = useReducedMotion();

  const volar = useCallback(
    (producto: Producto, from: DOMRect) => {
      if (reduce) return;
      const target = Array.from(
        document.querySelectorAll<HTMLElement>("[data-fly-target]")
      ).find((el) => el.offsetParent !== null);
      if (!target) return;

      const to = target.getBoundingClientRect();
      const fromCx = from.left + from.width / 2;
      const fromCy = from.top + from.height / 2;
      const toCx = to.left + to.width / 2;
      const toCy = to.top + to.height / 2;

      pulsarDestino(target);

      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now() + Math.random());

      setVuelos((v) => [
        ...v,
        { id, producto, from, dx: toCx - fromCx, dy: toCy - fromCy },
      ]);
    },
    [reduce]
  );

  return (
    <Ctx.Provider value={{ volar }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[70]">
            <AnimatePresence>
              {vuelos.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{
                    x: f.from.left,
                    y: f.from.top,
                    width: f.from.width,
                    height: f.from.height,
                    opacity: 0.95,
                    rotate: 0,
                  }}
                  animate={{
                    x: [f.from.left, f.from.left + f.dx],
                    // arco: sube un poco antes de caer al carrito
                    y: [
                      f.from.top,
                      f.from.top + f.dy * 0.35 - 70,
                      f.from.top + f.dy,
                    ],
                    width: [f.from.width, 52],
                    height: [f.from.height, 52],
                    opacity: [0.95, 0.95, 0.25],
                    rotate: [0, 14],
                    scale: [1, 0.9, 0.4],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  onAnimationComplete={() =>
                    setVuelos((v) => v.filter((x) => x.id !== f.id))
                  }
                  className="absolute left-0 top-0 rounded-2xl bg-[var(--surface)]/80 p-1 shadow-calida backdrop-blur-sm"
                >
                  <ProductoImagen producto={f.producto} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </Ctx.Provider>
  );
}

export function useFlyToCart(): FlyCtx {
  return useContext(Ctx) ?? { volar: () => {} };
}

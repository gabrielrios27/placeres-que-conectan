import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { formatoARS } from "../data/productos";

/**
 * Interpola el número viejo→nuevo (~600 ms, easeOut) y lo formatea en $ argentino.
 * Respeta prefers-reduced-motion (salta directo al valor final).
 */
export default function NumeroAnimado({
  valor,
  className = "",
}: {
  valor: number;
  className?: string;
}) {
  const [mostrado, setMostrado] = useState(valor);
  const anterior = useRef(valor);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setMostrado(valor);
      anterior.current = valor;
      return;
    }
    const controls = animate(anterior.current, valor, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setMostrado(v),
    });
    anterior.current = valor;
    return () => controls.stop();
  }, [valor, reduce]);

  return (
    <span className={className} aria-live="polite">
      {formatoARS(Math.round(mostrado))}
    </span>
  );
}

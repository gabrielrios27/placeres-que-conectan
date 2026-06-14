import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Estacion } from "../lib/estacion";

interface Particula {
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rot: number;
}

function generar(n: number, seed: number): Particula[] {
  // PRNG simple y determinístico para evitar saltos entre renders.
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: n }, () => ({
    left: rnd() * 100,
    size: 6 + rnd() * 14,
    delay: rnd() * 8,
    duration: 9 + rnd() * 10,
    drift: (rnd() - 0.5) * 80,
    rot: rnd() * 360,
  }));
}

function FormaParticula({ estacion, size }: { estacion: Estacion; size: number }) {
  const color = "var(--particle)";
  if (estacion === "otono") {
    // hoja de olivo
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="5" ry="11" fill={color} transform="rotate(35 12 12)" />
      </svg>
    );
  }
  if (estacion === "primavera") {
    // pétalo
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 C18 8 18 16 12 22 C6 16 6 8 12 2 Z" fill={color} />
      </svg>
    );
  }
  if (estacion === "invierno") {
    // bruma: círculo difuminado
    return (
      <span
        style={{
          width: size * 2,
          height: size * 2,
          background: color,
          filter: "blur(10px)",
          borderRadius: "999px",
          display: "block",
        }}
      />
    );
  }
  // verano: destello dorado
  return (
    <span
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size}px ${color}`,
        borderRadius: "999px",
        display: "block",
      }}
    />
  );
}

export default function FondoEstacion({ estacion }: { estacion: Estacion }) {
  const reduce = useReducedMotion();
  const cantidad = estacion === "invierno" ? 7 : 14;
  const particulas = useMemo(
    () => generar(cantidad, estacion.length * 1000 + cantidad),
    [estacion, cantidad]
  );

  // Apagado total con prefers-reduced-motion (§9.2, §10).
  if (reduce) return null;

  const caeHaciaArriba = estacion === "primavera" || estacion === "invierno";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity: estacion === "invierno" ? 0.18 : 0.28 }}
    >
      {particulas.map((p, i) => (
        <motion.div
          key={`${estacion}-${i}`}
          className="absolute"
          style={{ left: `${p.left}%`, top: caeHaciaArriba ? "100%" : "-5%" }}
          initial={{ opacity: 0 }}
          animate={{
            y: caeHaciaArriba ? -window.innerHeight * 1.1 : window.innerHeight * 1.1,
            x: [0, p.drift, 0],
            rotate: estacion === "verano" ? 0 : [p.rot, p.rot + 180],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <FormaParticula estacion={estacion} size={p.size} />
        </motion.div>
      ))}
    </div>
  );
}

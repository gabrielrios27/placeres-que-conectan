import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

/** Stepper [ − cantidad + ] reutilizable (tarjeta y panel). */
export default function Stepper({
  cantidad,
  onAgregar,
  onQuitar,
  nombre,
  tamano = "md",
}: {
  cantidad: number;
  onAgregar: () => void;
  onQuitar: () => void;
  nombre: string;
  tamano?: "sm" | "md";
}) {
  const btn =
    tamano === "sm"
      ? "h-8 w-8"
      : "h-10 w-10";
  const num = tamano === "sm" ? "min-w-[1.75rem] text-sm" : "min-w-[2.25rem] text-base";

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-tborder bg-[var(--surface-2)] p-1">
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onQuitar}
        disabled={cantidad === 0}
        aria-label={`Quitar uno de ${nombre}`}
        className={`grid ${btn} place-items-center rounded-full text-[var(--text)] transition disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:bg-[var(--surface)] enabled:active:bg-[var(--surface)]`}
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </motion.button>

      <span
        className={`${num} text-center font-bold tabular-nums text-[var(--text)]`}
        aria-live="polite"
        aria-label={`Cantidad: ${cantidad}`}
      >
        {cantidad}
      </span>

      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onAgregar}
        aria-label={`Agregar ${nombre}`}
        className={`grid ${btn} place-items-center rounded-full bg-accent text-[var(--on-accent)] shadow-calida-sm transition hover:bg-accent-strong`}
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

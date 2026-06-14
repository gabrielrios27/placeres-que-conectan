import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trash2, ShoppingBasket } from "lucide-react";
import { formatoARS } from "../data/productos";
import { usePaquete } from "../hooks/usePaquete";
import { armarLinkWhatsApp } from "../lib/whatsapp";
import ProductoImagen from "./ProductoImagen";
import NumeroAnimado from "./NumeroAnimado";
import Stepper from "./Stepper";

const itemVariants = {
  inicial: { opacity: 0, y: 12, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 380, damping: 30 },
  },
  salida: {
    opacity: 0,
    x: 24,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.25 },
  },
};

export default function PanelPaquete({ onCerrar }: { onCerrar?: () => void }) {
  const { items, total, cantidadTotal, agregar, quitar, vaciar } = usePaquete();
  const reduce = useReducedMotion();
  const [confirmandoVaciar, setConfirmandoVaciar] = useState(false);

  const vacio = items.length === 0;

  const finalizar = () => {
    if (vacio) return;
    const link = armarLinkWhatsApp(
      items.map((i) => ({
        nombre: i.producto.nombre,
        cantidad: i.cantidad,
        precio: i.producto.precio,
      })),
      total
    );
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      {/* Encabezado */}
      <div className="flex shrink-0 items-center gap-2 border-b border-tborder px-5 py-4">
        <span data-fly-target className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface-2)]">
          <ShoppingBasket className="h-4 w-4 text-accent" />
        </span>
        <h3 className="font-serif text-xl font-semibold text-[var(--text)]">
          Mi paquete
        </h3>
        {cantidadTotal > 0 && (
          <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-[var(--on-accent)]">
            {cantidadTotal}
          </span>
        )}
      </div>

      {/* Lista / estado vacío */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {vacio ? (
          <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="text-5xl" aria-hidden="true">
              🫒
            </span>
            <p className="text-[var(--text-soft)]">
              Todavía no agregaste nada. Sumá productos para armar tu paquete.
            </p>
          </div>
        ) : (
          <motion.ul layout className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {items.map((i) => (
                <motion.li
                  key={i.producto.id}
                  layout
                  variants={itemVariants}
                  initial="inicial"
                  animate="visible"
                  exit="salida"
                  className="superficie flex items-center gap-3 overflow-hidden rounded-2xl border p-2.5"
                >
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-[var(--surface-2)] p-1">
                    <ProductoImagen producto={i.producto} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text)]">
                      {i.producto.nombre}
                    </p>
                    <p className="text-xs text-[var(--text-soft)]">
                      {i.cantidad} × {formatoARS(i.producto.precio)} ={" "}
                      <span className="font-bold text-[var(--text)]">
                        {formatoARS(i.subtotal)}
                      </span>
                    </p>
                    <div className="mt-1.5">
                      <Stepper
                        cantidad={i.cantidad}
                        onAgregar={() => agregar(i.producto.id)}
                        onQuitar={() => quitar(i.producto.id)}
                        nombre={i.producto.nombre}
                        tamano="sm"
                      />
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      {/* Pie: total + acciones */}
      <div className="shrink-0 border-t border-tborder bg-[var(--surface)] px-5 py-4">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-sm font-medium text-[var(--text-soft)]">Total estimado</span>
          <NumeroAnimado
            valor={total}
            className="font-serif text-3xl font-bold text-accent-strong"
          />
        </div>

        <motion.button
          type="button"
          whileHover={reduce || vacio ? undefined : { scale: 1.02 }}
          whileTap={reduce || vacio ? undefined : { scale: 0.98 }}
          onClick={finalizar}
          disabled={vacio}
          className="glow-acento flex w-full items-center justify-center gap-2 rounded-full bg-[#0B7A3C] px-5 py-3.5 text-base font-bold text-white shadow-calida transition disabled:cursor-not-allowed disabled:bg-[var(--surface-2)] disabled:text-[var(--text-soft)] disabled:shadow-none enabled:hover:bg-[#0A6E36]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.739-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          Finalizar pedido por WhatsApp
        </motion.button>

        {!vacio && (
          <div className="mt-2 flex items-center justify-center">
            {confirmandoVaciar ? (
              <span className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
                ¿Vaciar todo?
                <button
                  type="button"
                  onClick={() => {
                    vaciar();
                    setConfirmandoVaciar(false);
                  }}
                  className="font-semibold text-terra-500 underline underline-offset-2"
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoVaciar(false)}
                  className="font-semibold text-[var(--text)] underline underline-offset-2"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmandoVaciar(true)}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-soft)] transition hover:text-terra-500"
              >
                <Trash2 className="h-4 w-4" />
                Vaciar paquete
              </button>
            )}
          </div>
        )}

        <p className="mt-3 text-center text-xs leading-relaxed text-[var(--text-soft)]">
          No se cobra nada en la web. El pedido se cierra por WhatsApp, donde te
          atendemos personalmente. Los precios son estimados y se confirman ahí.
        </p>

        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="mt-3 w-full rounded-full border border-tborder py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--surface-2)]"
          >
            Seguir comprando
          </button>
        )}
      </div>
    </div>
  );
}

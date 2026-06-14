import { forwardRef, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Producto } from "../data/productos";
import { formatoARS } from "../data/productos";
import { ESTILO_CATEGORIA } from "../lib/categorias";
import { usePaquete } from "../hooks/usePaquete";
import { useFlyToCart } from "./FlyToCart";
import ProductoImagen from "./ProductoImagen";
import Stepper from "./Stepper";

const TarjetaProducto = forwardRef<HTMLDivElement, { producto: Producto }>(
  function TarjetaProducto({ producto }, ref) {
  const { cantidadDe, agregar, quitar } = usePaquete();
  const { volar } = useFlyToCart();
  const cantidad = cantidadDe(producto.id);
  const reduce = useReducedMotion();
  const estilo = ESTILO_CATEGORIA[producto.categoria];

  const imgRef = useRef<HTMLDivElement>(null);
  const [pulso, setPulso] = useState(0);

  const onAgregar = () => {
    agregar(producto.id);
    if (!reduce) {
      setPulso((n) => n + 1);
      if (imgRef.current) volar(producto, imgRef.current.getBoundingClientRect());
    }
  };

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      whileHover={reduce ? undefined : { y: -6 }}
      className={`superficie group relative flex flex-col overflow-hidden rounded-3xl border shadow-calida-sm transition-shadow hover:shadow-calida ${
        cantidad > 0 ? "ring-2 ring-accent/60" : ""
      }`}
    >
      {/* Imagen flotante */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[var(--surface-2)] to-transparent p-4">
        <motion.div
          ref={imgRef}
          className="h-full w-full"
          whileHover={reduce ? undefined : { scale: 1.06, rotate: -1.5 }}
          animate={pulso ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ProductoImagen producto={producto} className="h-full w-full drop-shadow-[0_18px_22px_var(--shadow)]" />
        </motion.div>

        {/* brillo sutil al pasar el mouse */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        {/* Chip de categoría */}
        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-calida-sm"
          style={{ backgroundColor: estilo.color }}
        >
          <span aria-hidden="true">{estilo.emoji}</span>
          {producto.categoria}
        </span>

        {producto.destacado && (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--surface)]/90 px-2.5 py-1 text-xs font-semibold text-accent-strong shadow-calida-sm">
            ★ Destacado
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-3 p-4 pt-2">
        <h3 className="font-serif text-lg font-semibold leading-snug text-[var(--text)]">
          {producto.nombre}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-[var(--text-soft)]">Precio</span>
            <span className="text-2xl font-extrabold text-accent-strong">
              {formatoARS(producto.precio)}
            </span>
          </div>
          <Stepper
            cantidad={cantidad}
            onAgregar={onAgregar}
            onQuitar={() => quitar(producto.id)}
            nombre={producto.nombre}
          />
        </div>
      </div>
    </motion.article>
  );
  }
);

export default TarjetaProducto;

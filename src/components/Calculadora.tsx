import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Search, ShoppingBasket, X } from "lucide-react";
import { PRODUCTOS, type Categoria } from "../data/productos";
import { FILTROS } from "../lib/categorias";
import { usePaquete } from "../hooks/usePaquete";
import TarjetaProducto from "./TarjetaProducto";
import PanelPaquete from "./PanelPaquete";

type Filtro = Categoria | "Todos";

export default function Calculadora() {
  const { cantidadTotal } = usePaquete();
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const productos = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return PRODUCTOS.filter((p) => {
      const okFiltro = filtro === "Todos" || p.categoria === filtro;
      const okBusqueda = q === "" || p.nombre.toLowerCase().includes(q);
      return okFiltro && okBusqueda;
    });
  }, [filtro, busqueda]);

  // Esc cierra el drawer (§12)
  useEffect(() => {
    if (!drawerAbierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerAbierto(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerAbierto]);

  return (
    <section id="calculadora" className="relative scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <p className="fuente-script text-2xl text-accent">Armá tu paquete</p>
          <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
            Elegí tus productos
          </h2>
          <p className="mt-3 text-[var(--text-soft)]">
            Sumá o restá lo que quieras y mirá el total en tiempo real. Cuando
            estés listo, lo enviás por WhatsApp.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Catálogo (2/3) */}
          <div className="lg:col-span-2">
            {/* Filtros + buscador */}
            <div className="mb-6 flex flex-col gap-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-soft)]" />
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar producto…"
                  aria-label="Buscar producto por nombre"
                  className="superficie w-full rounded-full border py-3 pl-11 pr-4 text-[var(--text)] placeholder:text-[var(--text-soft)] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <LayoutGroup id="filtros">
                  {FILTROS.map((f) => {
                    const activo = filtro === f.valor;
                    return (
                      <button
                        key={f.valor}
                        type="button"
                        onClick={() => setFiltro(f.valor)}
                        aria-pressed={activo}
                        className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${
                          activo
                            ? "text-[var(--on-accent)]"
                            : "superficie border text-[var(--text-soft)] hover:text-[var(--text)]"
                        }`}
                      >
                        {activo && (
                          <motion.span
                            layoutId="chip-activo"
                            className="absolute inset-0 rounded-full bg-accent"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10">{f.etiqueta}</span>
                      </button>
                    );
                  })}
                </LayoutGroup>
              </div>
            </div>

            {/* Grid de productos */}
            <motion.div
              layout
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {productos.map((p) => (
                  <TarjetaProducto key={p.id} producto={p} />
                ))}
              </AnimatePresence>
            </motion.div>

            {productos.length === 0 && (
              <p className="py-16 text-center text-[var(--text-soft)]">
                No encontramos productos con ese criterio.
              </p>
            )}
          </div>

          {/* Sidebar sticky (desktop, 1/3) */}
          <aside className="hidden lg:block">
            <div className="superficie sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-3xl border shadow-calida">
              <PanelPaquete />
            </div>
          </aside>
        </div>
      </div>

      {/* Botón flotante (mobile) */}
      <div className="lg:hidden">
        <AnimatePresence>
          {!drawerAbierto && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              onClick={() => setDrawerAbierto(true)}
              data-fly-target
              className="glow-acento fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-[var(--on-accent)] shadow-calida-lg"
            >
              <ShoppingBasket className="h-5 w-5" />
              Mi paquete
              {cantidadTotal > 0 && (
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[var(--on-accent)] px-1.5 text-sm font-extrabold text-accent">
                  {cantidadTotal}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Drawer (mobile) */}
      <AnimatePresence>
        {drawerAbierto && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mi paquete">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerAbierto(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              className="superficie absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-3xl border-t shadow-calida-lg"
            >
              <button
                type="button"
                onClick={() => setDrawerAbierto(false)}
                aria-label="Cerrar paquete"
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-2)] text-[var(--text)]"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-[var(--border)]" />
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <PanelPaquete onCerrar={() => setDrawerAbierto(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

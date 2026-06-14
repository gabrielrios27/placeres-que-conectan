import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles, Menu, X } from "lucide-react";
import { MARCA } from "../lib/marca";
import type { PrefTema } from "../hooks/useTema";

const LINKS = [
  { href: "#como-comprar", label: "Cómo comprar" },
  { href: "#calculadora", label: "Calculadora" },
  { href: "#sobre-nosotros", label: "Nosotros" },
];

function ToggleTema({
  pref,
  setPref,
}: {
  pref: PrefTema;
  setPref: (p: PrefTema) => void;
}) {
  const opciones: { valor: PrefTema; icono: typeof Sun; label: string }[] = [
    { valor: "claro", icono: Sun, label: "Tema claro" },
    { valor: "auto", icono: Sparkles, label: "Tema automático" },
    { valor: "oscuro", icono: Moon, label: "Tema oscuro" },
  ];
  return (
    <div
      className="relative flex items-center gap-0.5 rounded-full border border-tborder bg-[var(--surface-2)] p-1"
      role="group"
      aria-label="Cambiar tema"
    >
      {opciones.map(({ valor, icono: Icono, label }) => {
        const activo = pref === valor;
        return (
          <button
            key={valor}
            type="button"
            onClick={() => setPref(valor)}
            aria-label={label}
            aria-pressed={activo}
            title={label}
            className="relative grid h-8 w-8 place-items-center rounded-full"
          >
            {activo && (
              <motion.span
                layoutId="toggle-activo"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icono
              className={`relative z-10 h-4 w-4 ${activo ? "text-[var(--on-accent)]" : "text-[var(--text-soft)]"}`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function Header({
  pref,
  setPref,
}: {
  pref: PrefTema;
  setPref: (p: PrefTema) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-tborder bg-[var(--bg)]/80 py-2 shadow-calida-sm backdrop-blur-md"
          : "border-b border-transparent py-3"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2.5" aria-label="Inicio">
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            className="h-10 w-10 shrink-0"
          />
          <span className="flex flex-col leading-none">
            <span className="fuente-script text-xl text-accent sm:text-2xl">
              {MARCA.nombre}
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-wider text-[var(--text-soft)] sm:block">
              {MARCA.subtitulo}
            </span>
          </span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ToggleTema pref={pref} setPref={setPref} />
          <a
            href="#calculadora"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-bold text-[var(--on-accent)] shadow-calida-sm transition hover:bg-accent-strong sm:inline-block"
          >
            Armar mi paquete
          </a>
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            className="grid h-9 w-9 place-items-center rounded-full border border-tborder bg-[var(--surface-2)] text-[var(--text)] md:hidden"
          >
            {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {menuAbierto && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden px-4 md:hidden"
        >
          <div className="superficie mt-2 flex flex-col gap-1 rounded-2xl border p-2">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuAbierto(false)}
                className="rounded-xl px-4 py-3 font-medium text-[var(--text)] transition hover:bg-[var(--surface-2)]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#calculadora"
              onClick={() => setMenuAbierto(false)}
              className="rounded-xl bg-accent px-4 py-3 text-center font-bold text-[var(--on-accent)]"
            >
              Armar mi paquete
            </a>
          </div>
        </motion.nav>
      )}
    </header>
  );
}

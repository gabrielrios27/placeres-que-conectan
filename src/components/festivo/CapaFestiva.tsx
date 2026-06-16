import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Gift, X } from "lucide-react";
import {
  festividadActiva,
  festividadOverride,
  textoCuenta,
  type FestividadActiva,
} from "../../lib/festividades";
import IconoFestivo from "./IconoFestivo";
import Mono from "./Mono";

const STORAGE_KEY = "festivo_cerrado";

function claveCierre(a: FestividadActiva) {
  return `${a.fest.id}-${a.fecha.getFullYear()}`;
}

/** Partículas festivas ambientales (regalos, moños, chispas) en color motif. */
function ParticulasFestivas({ activa }: { activa: FestividadActiva }) {
  const reduce = useReducedMotion();
  const particulas = useMemo(() => {
    let s = activa.fest.id.length * 97 + 13;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const tipos = [activa.fest.icono, "mono", "chispa"] as const;
    return Array.from({ length: 12 }, (_, i) => ({
      left: rnd() * 100,
      size: 16 + rnd() * 22,
      delay: rnd() * 9,
      dur: 11 + rnd() * 10,
      drift: (rnd() - 0.5) * 70,
      rot: rnd() * 360,
      tipo: tipos[i % tipos.length],
      color: i % 2 === 0 ? activa.fest.motif : activa.fest.motif2,
    }));
  }, [activa]);

  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ opacity: 0.5 }}>
      {particulas.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${p.left}%`, top: "-6%", color: p.color }}
          initial={{ opacity: 0 }}
          animate={{
            y: ["-6vh", "108vh"],
            x: [0, p.drift, 0],
            rotate: [p.rot, p.rot + 160],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          <IconoFestivo tipo={p.tipo} style={{ width: p.size, height: p.size }} />
        </motion.div>
      ))}
    </div>
  );
}

export default function CapaFestiva() {
  const reduce = useReducedMotion();
  const [activa, setActiva] = useState<FestividadActiva | null>(() => {
    const ov = festividadOverride();
    return ov !== undefined ? ov : festividadActiva();
  });
  const [cerrado, setCerrado] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Recalcula la festividad activa cada hora (por si cambia el día).
  useEffect(() => {
    const id = window.setInterval(() => {
      const ov = festividadOverride();
      setActiva(ov !== undefined ? ov : festividadActiva());
    }, 60 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  // ¿El usuario ya cerró el cartel de esta festividad?
  useEffect(() => {
    if (!activa) return;
    try {
      setCerrado(window.localStorage.getItem(STORAGE_KEY) === claveCierre(activa));
    } catch {
      setCerrado(false);
    }
  }, [activa]);

  const visible = !!activa && !cerrado;

  // Empuja el header hacia abajo según el alto real del cartel.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!visible || !barRef.current) {
      root.style.setProperty("--festive-bar-h", "0px");
      return;
    }
    const set = () =>
      root.style.setProperty("--festive-bar-h", `${barRef.current!.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(barRef.current);
    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
      root.style.setProperty("--festive-bar-h", "0px");
    };
  }, [visible]);

  const cerrar = () => {
    if (activa) {
      try {
        window.localStorage.setItem(STORAGE_KEY, claveCierre(activa));
      } catch {
        /* ignore */
      }
    }
    setCerrado(true);
  };

  if (!activa) return null;
  const { fest } = activa;

  return (
    <>
      {/* Partículas + moños de fondo (siempre que haya festividad y no esté cerrado) */}
      {visible && <ParticulasFestivas activa={activa} />}
      {visible && (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed left-[-26px] z-0 hidden w-44 opacity-[0.13] lg:block"
            style={{ top: "calc(var(--festive-bar-h) + 88px)", color: fest.motif }}
          >
            <Mono className="w-full -rotate-12" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none fixed right-[-26px] z-0 hidden w-44 opacity-[0.13] lg:block"
            style={{ top: "calc(var(--festive-bar-h) + 88px)", color: fest.motif2 }}
          >
            <Mono className="w-full rotate-12" />
          </div>
        </>
      )}

      {/* Cartel / barra de anuncio festiva (respeta el tema vía --accent) */}
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={barRef}
            initial={reduce ? false : { y: "-100%" }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            role="region"
            aria-label={`Anuncio: ${fest.nombre}`}
            className="glow-acento fixed inset-x-0 top-0 z-50 overflow-hidden text-[var(--on-accent)] shadow-calida"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--accent-strong), var(--accent), var(--accent-2))",
            }}
          >
            {/* destello festivo en color motif, muy sutil */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage: `radial-gradient(circle at 12% 50%, ${fest.motif}, transparent 35%), radial-gradient(circle at 88% 50%, ${fest.motif2}, transparent 35%)`,
              }}
            />
            <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-10 py-2 sm:px-12">
              <span className="shrink-0 text-lg" aria-hidden>
                {fest.emoji}
              </span>
              <strong className="font-serif text-sm font-bold sm:text-base">
                {fest.titulo}
              </strong>
              <span className="rounded-full bg-[var(--on-accent)]/15 px-2.5 py-0.5 text-xs font-semibold">
                {textoCuenta(activa.dias)}
              </span>
              <span className="hidden text-sm opacity-90 md:inline">{fest.mensaje}</span>
              <a
                href={fest.ctaHref}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--surface)] px-3.5 py-1.5 text-sm font-bold text-[var(--text)] shadow-calida-sm transition hover:scale-[1.03]"
              >
                <Gift className="h-4 w-4 text-accent-strong" />
                {fest.cta}
              </a>
            </div>

            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar anuncio festivo"
              className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-[var(--on-accent)] transition hover:bg-[var(--on-accent)]/15"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA flotante de regalo (desktop) */}
      {visible && (
        <motion.a
          href={fest.ctaHref}
          initial={reduce ? false : { opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glow-acento fixed bottom-5 left-5 z-40 hidden items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-bold text-[var(--on-accent)] shadow-calida-lg lg:flex"
          style={{ borderBottom: `3px solid ${fest.motif}` }}
        >
          <span className="grid h-6 w-6 place-items-center rounded-full" style={{ color: fest.motif }}>
            <IconoFestivo tipo={fest.icono} className="h-5 w-5" />
          </span>
          {fest.cta}
        </motion.a>
      )}
    </>
  );
}

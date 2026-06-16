import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Leaf } from "lucide-react";
import { MARCA } from "../lib/marca";
import { RamaOlivo, GotaAceite } from "./Decoraciones";

const contenedor = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const item = {
  oculto: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, reduce ? 0 : 90]);
  const y2 = useTransform(scrollY, [0, 500], [0, reduce ? 0 : -70]);

  return (
    <section
      id="inicio"
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 pt-24"
    >
      {/* Aurora: luces cálidas difuminadas en movimiento lento */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-[28rem] w-[28rem] rounded-full opacity-40 blur-[90px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full opacity-35 blur-[90px]"
        style={{ background: "radial-gradient(circle, var(--accent-2), transparent 70%)" }}
        animate={reduce ? undefined : { x: [0, -36, 0], y: [0, -28, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ramas de olivo con parallax */}
      <motion.div
        style={{ y: y1 }}
        className="pointer-events-none absolute -left-10 top-24 w-64 text-oliva-500/40 sm:w-96"
      >
        <RamaOlivo className="animate-flotar" />
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        className="pointer-events-none absolute -right-12 bottom-16 w-64 rotate-180 text-oliva-700/35 sm:w-96"
      >
        <RamaOlivo className="animate-flotar" style={{ animationDelay: "1.5s" }} />
      </motion.div>
      <GotaAceite className="pointer-events-none absolute right-[18%] top-[22%] hidden w-7 text-ambar-400/50 sm:block animate-flotar" />
      <GotaAceite className="pointer-events-none absolute left-[16%] bottom-[24%] hidden w-5 text-terra-300/50 md:block animate-flotar" />

      <motion.div
        variants={contenedor}
        initial="oculto"
        animate="visible"
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <motion.div variants={item} className="mb-6 flex justify-center">
          <div className="relative">
            {/* halo suave detrás del logo */}
            <div
              className="absolute inset-0 -z-10 scale-150 rounded-full opacity-50 blur-2xl"
              style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)" }}
              aria-hidden="true"
            />
            <motion.img
              src="/logo-real.png"
              alt={`Logo de ${MARCA.nombre}`}
              className="h-32 w-32 object-contain drop-shadow-[0_18px_30px_var(--shadow)] sm:h-44 sm:w-44"
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-tborder bg-[var(--surface)]/70 px-4 py-1.5 text-sm font-medium text-[var(--text-soft)] backdrop-blur"
        >
          <Leaf className="h-4 w-4 text-oliva-500" />
          {MARCA.ciudad}
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-6xl"
        >
          Sabores que nacen en{" "}
          <span className="text-accent">San Juan</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="fuente-script mt-3 text-3xl text-accent-2 sm:text-4xl"
        >
          Placeres que conectan
        </motion.p>

        <motion.p
          variants={item}
          className="mx-auto mt-5 max-w-xl text-lg text-[var(--text-soft)]"
        >
          Aceite de oliva virgen extra, aceitunas, aceto balsámico y dulces
          artesanales de productores de San Juan. Armá tu paquete y pedilo por WhatsApp.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.a
            href="#calculadora"
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="glow-acento w-full rounded-full bg-accent px-8 py-4 text-lg font-bold text-[var(--on-accent)] shadow-calida transition hover:bg-accent-strong sm:w-auto"
          >
            Armar mi paquete
          </motion.a>
          <a
            href="#como-comprar"
            className="w-full rounded-full border border-tborder bg-[var(--surface)]/60 px-8 py-4 text-lg font-semibold text-[var(--text)] backdrop-blur transition hover:bg-[var(--surface-2)] sm:w-auto"
          >
            Cómo comprar
          </a>
        </motion.div>
      </motion.div>

      {!reduce && (
        <motion.a
          href="#como-comprar"
          aria-hidden="true"
          tabIndex={-1}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[var(--text-soft)]"
        >
          <ArrowDown className="h-6 w-6" />
        </motion.a>
      )}
    </section>
  );
}

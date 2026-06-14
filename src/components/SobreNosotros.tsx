import { motion } from "framer-motion";
import { Heart, MapPin, Sprout } from "lucide-react";
import { RamaOlivo } from "./Decoraciones";

const VALORES = [
  { icono: Sprout, titulo: "Productores locales", texto: "Elegimos aceite, aceitunas, aceto y dulces de empresas y productores de San Juan." },
  { icono: Heart, titulo: "Atención familiar", texto: "Somos una familia sanjuanina y te atendemos personalmente, uno a uno." },
  { icono: MapPin, titulo: "Cerca tuyo", texto: "Coordinamos entrega y pago directamente con vos por WhatsApp." },
];

export default function SobreNosotros() {
  return (
    <section id="sobre-nosotros" className="relative scroll-mt-20 overflow-hidden py-16 sm:py-24">
      <RamaOlivo className="pointer-events-none absolute -right-16 -top-6 w-80 rotate-12 text-oliva-500/15" />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="fuente-script text-2xl text-accent">Nuestra historia</p>
          <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
            Delicias regionales de San Juan
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-soft)]">
            <span className="font-semibold text-[var(--text)]">Placeres que Conectan</span> es
            un emprendimiento familiar de San Juan. No fabricamos: elegimos y
            acercamos a tu mesa lo mejor de productores y empresas de la región
            —aceite de oliva virgen extra, aceitunas verdes y griegas, aceto
            balsámico y dulces artesanales—. Productos honestos, de sabor real,
            con la atención cercana de siempre.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {VALORES.map((v, i) => (
            <motion.div
              key={v.titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1 }}
              className="superficie rounded-3xl border p-6 shadow-calida-sm"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--surface-2)] text-accent">
                <v.icono className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold">{v.titulo}</h3>
              <p className="mt-1.5 text-sm text-[var(--text-soft)]">{v.texto}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

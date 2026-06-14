import { motion } from "framer-motion";
import { ListChecks, MessageCircle, Handshake } from "lucide-react";

const PASOS = [
  {
    icono: ListChecks,
    titulo: "Armá tu paquete",
    texto: "Sumá o restá productos. Vas viendo el total en tiempo real.",
  },
  {
    icono: MessageCircle,
    titulo: "Tocá “Finalizar por WhatsApp”",
    texto: "Se abre el chat con tu pedido ya escrito, listo para enviar.",
  },
  {
    icono: Handshake,
    titulo: "Coordinamos con vos",
    texto: "Confirmamos stock, pago y entrega directamente por WhatsApp.",
  },
];

export default function ComoComprar() {
  return (
    <section id="como-comprar" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="fuente-script text-2xl text-accent">Es muy fácil</p>
          <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
            Cómo comprar
          </h2>
          <p className="mt-3 text-[var(--text-soft)]">
            No se cobra nada en la web: la web solo arma tu pedido. La compra se
            cierra por WhatsApp, donde te atendemos personalmente.
          </p>
        </motion.header>

        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PASOS.map((p, i) => (
            <motion.li
              key={p.titulo}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 120, damping: 18 }}
              className="superficie relative flex flex-col items-center rounded-3xl border p-7 text-center shadow-calida-sm"
            >
              <span className="absolute -top-3 left-1/2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-accent text-sm font-extrabold text-[var(--on-accent)] shadow-calida-sm">
                {i + 1}
              </span>
              <span className="mt-2 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--surface-2)] text-accent">
                <p.icono className="h-8 w-8" />
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold">{p.titulo}</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{p.texto}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

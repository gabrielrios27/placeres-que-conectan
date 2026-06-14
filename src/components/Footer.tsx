import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { MARCA } from "../lib/marca";

export default function Footer() {
  const waLink = `https://wa.me/${MARCA.whatsapp}`;
  return (
    <footer className="superficie border-t border-tborder">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" aria-hidden="true" className="h-10 w-10" />
            <span className="fuente-script text-2xl text-accent">{MARCA.nombre}</span>
          </div>
          <p className="mt-3 text-sm text-[var(--text-soft)]">{MARCA.subtitulo}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-soft)]">
            <MapPin className="h-4 w-4" />
            {MARCA.ciudad}
          </p>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold">Contacto</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--text-soft)] transition hover:text-accent"
              >
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                WhatsApp · {MARCA.whatsappVisible}
              </a>
            </li>
            <li>
              <a
                href={MARCA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--text-soft)] transition hover:text-accent"
              >
                <Instagram className="h-5 w-5" />
                {MARCA.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold">Navegación</h3>
          <ul className="mt-3 space-y-2 text-[var(--text-soft)]">
            <li><a href="#como-comprar" className="transition hover:text-accent">Cómo comprar</a></li>
            <li><a href="#calculadora" className="transition hover:text-accent">Calculadora</a></li>
            <li><a href="#sobre-nosotros" className="transition hover:text-accent">Nosotros</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-tborder px-4 py-5 text-center text-sm text-[var(--text-soft)]">
        © {new Date().getFullYear()} {MARCA.nombre} · Hecho con cariño en {MARCA.ciudad} 🫒
      </div>
    </footer>
  );
}

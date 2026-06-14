import { useState } from "react";
import type { Categoria, Producto } from "../data/productos";

type Silueta = "botella" | "botella-grande" | "frasco" | "pan";

interface ConfigPlaceholder {
  silueta: Silueta;
  color: string; // color del contenido
  vidrio: string; // tinte del vidrio/contorno
}

/** Config explícita para los 6 productos sin foto (§6.3). */
const PLACEHOLDERS: Record<string, ConfigPlaceholder> = {
  "aceite-5l": { silueta: "botella-grande", color: "#6B7F3A", vidrio: "#4A5A2B" },
  "merm-durazno": { silueta: "frasco", color: "#E2B25A", vidrio: "#C8902E" },
  "merm-membrillo": { silueta: "frasco", color: "#C0622D", vidrio: "#9E4A22" },
  "merm-pera": { silueta: "frasco", color: "#9CAA6B", vidrio: "#6B7F3A" },
  "dulce-zapallito": { silueta: "frasco", color: "#6B7F3A", vidrio: "#4A5A2B" },
  "dulce-membrillo-pan": { silueta: "pan", color: "#9E4A22", vidrio: "#7A3A1B" },
};

function configPorCategoria(cat: Categoria): ConfigPlaceholder {
  switch (cat) {
    case "Aceite de Oliva":
      return { silueta: "botella", color: "#9CAA6B", vidrio: "#4A5A2B" };
    case "Aceto":
      return { silueta: "botella", color: "#7A3A55", vidrio: "#4A2236" };
    case "Aceituna Verde":
      return { silueta: "frasco", color: "#9CAA6B", vidrio: "#6B7F3A" };
    case "Aceituna Negra":
      return { silueta: "frasco", color: "#3B2A24", vidrio: "#2C1E14" };
    default:
      return { silueta: "frasco", color: "#E2B25A", vidrio: "#C8902E" };
  }
}

function Silueta({ cfg }: { cfg: ConfigPlaceholder }) {
  const sombra = (
    <ellipse cx="100" cy="186" rx="46" ry="8" fill="rgba(44,30,20,0.18)" />
  );

  if (cfg.silueta === "pan") {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
        {sombra}
        <rect
          x="48"
          y="86"
          width="104"
          height="84"
          rx="14"
          fill={cfg.color}
          stroke={cfg.vidrio}
          strokeWidth="4"
        />
        <rect x="48" y="86" width="104" height="22" rx="11" fill={cfg.vidrio} opacity="0.5" />
        <ellipse cx="74" cy="118" rx="6" ry="9" fill="#ffffff" opacity="0.15" />
      </svg>
    );
  }

  const esBotella = cfg.silueta === "botella" || cfg.silueta === "botella-grande";
  if (esBotella) {
    const grande = cfg.silueta === "botella-grande";
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
        {sombra}
        {/* tapa */}
        <rect x="90" y="20" width="20" height="22" rx="4" fill={cfg.vidrio} />
        {/* cuello */}
        <rect x="92" y="40" width="16" height={grande ? 26 : 34} fill={cfg.vidrio} opacity="0.85" />
        {/* cuerpo */}
        <path
          d={
            grande
              ? "M70 66 Q70 60 80 60 L120 60 Q130 60 130 66 L134 168 Q134 178 124 178 L76 178 Q66 178 66 168 Z"
              : "M84 72 L84 92 Q70 104 70 130 L70 166 Q70 176 80 176 L120 176 Q130 176 130 166 L130 130 Q130 104 116 92 L116 72 Z"
          }
          fill={cfg.color}
          stroke={cfg.vidrio}
          strokeWidth="4"
        />
        {/* etiqueta */}
        <rect
          x={grande ? 78 : 80}
          y={grande ? 96 : 116}
          width={grande ? 44 : 40}
          height={grande ? 46 : 38}
          rx="4"
          fill="#FBF3E2"
          opacity="0.92"
        />
        <ellipse cx={grande ? 84 : 86} cy={grande ? 120 : 130} rx="5" ry="14" fill="#ffffff" opacity="0.18" />
      </svg>
    );
  }

  // frasco
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      {sombra}
      {/* tapa */}
      <rect x="64" y="40" width="72" height="22" rx="6" fill={cfg.vidrio} />
      {/* cuerpo */}
      <rect
        x="60"
        y="60"
        width="80"
        height="116"
        rx="16"
        fill={cfg.color}
        stroke={cfg.vidrio}
        strokeWidth="4"
      />
      {/* etiqueta */}
      <rect x="72" y="104" width="56" height="48" rx="6" fill="#FBF3E2" opacity="0.92" />
      <ellipse cx="78" cy="92" rx="6" ry="16" fill="#ffffff" opacity="0.18" />
    </svg>
  );
}

export default function ProductoImagen({
  producto,
  className = "",
}: {
  producto: Producto;
  className?: string;
}) {
  const [falla, setFalla] = useState(false);
  const cfg = PLACEHOLDERS[producto.id] ?? configPorCategoria(producto.categoria);

  if (falla) {
    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        role="img"
        aria-label={`${producto.nombre} (imagen ilustrativa)`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <Silueta cfg={cfg} />
        </div>
        <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[var(--surface-2)]/80 px-2 py-0.5 text-[10px] font-medium text-[var(--text-soft)]">
          {producto.categoria}
        </span>
      </div>
    );
  }

  return (
    <img
      src={producto.imagen}
      alt={producto.nombre}
      loading="lazy"
      decoding="async"
      onError={() => setFalla(true)}
      className={`h-full w-full object-contain ${className}`}
    />
  );
}

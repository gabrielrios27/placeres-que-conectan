import type { IconoFestivo as Tipo } from "../../lib/festividades";

/** Íconos festivos vectoriales. Usan currentColor → toman el color motif. */
export default function IconoFestivo({
  tipo,
  className = "",
  style,
}: {
  tipo: Tipo;
  className?: string;
  style?: React.CSSProperties;
}) {
  const p = { className, style, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (tipo) {
    case "regalo":
      return (
        <svg {...p} fill="currentColor">
          <path d="M3 11h18v9a1 1 0 0 1-1 1h-7v-10H3z" opacity=".55" />
          <path d="M3 11h8v10H4a1 1 0 0 1-1-1z" opacity=".8" />
          <rect x="2" y="7" width="20" height="4" rx="1" />
          <rect x="11" y="7" width="2" height="14" fill="#fff" opacity=".55" />
          <path d="M12 7C9 7 7 6 7 4.5S9 2.2 10 3.2 12 7 12 7zm0 0c3 0 5-1 5-2.5S15 2.2 14 3.2 12 7 12 7z" />
        </svg>
      );
    case "mono":
      return (
        <svg {...p} fill="currentColor">
          <circle cx="12" cy="12" r="2.2" />
          <path d="M12 12C8 8 3 8 3 12s5 4 9 0zM12 12c4-4 9-4 9 0s-5 4-9 0z" />
          <path d="M12 13c-1.5 2-3 5-3 7l3-2 3 2c0-2-1.5-5-3-7z" opacity=".8" />
        </svg>
      );
    case "corazon":
      return (
        <svg {...p} fill="currentColor">
          <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z" />
        </svg>
      );
    case "estrella":
      return (
        <svg {...p} fill="currentColor">
          <path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.7 6.6L12 16.8 6.1 20.3l1.7-6.6L2.6 9.3l6.8-.5z" />
        </svg>
      );
    case "flor":
      return (
        <svg {...p} fill="currentColor">
          <g>
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx="12" cy="6.5" rx="3" ry="5" transform={`rotate(${r} 12 12)`} />
            ))}
          </g>
          <circle cx="12" cy="12" r="3" fill="#fff" opacity=".7" />
        </svg>
      );
    case "arbol":
      return (
        <svg {...p} fill="currentColor">
          <path d="M12 2l4 6h-2.5l3 4.5h-2.5L17 17H7l3-4.5H7.5l3-4.5H8z" />
          <rect x="11" y="17" width="2" height="4" opacity=".7" />
          <circle cx="12" cy="3.2" r="1.1" fill="#fff" opacity=".85" />
        </svg>
      );
    case "corona":
      return (
        <svg {...p} fill="currentColor">
          <path d="M3 8l3.5 3L12 5l5.5 6L21 8l-1.5 9h-15z" />
          <rect x="4.5" y="17" width="15" height="2.4" rx="1" opacity=".8" />
          <circle cx="3" cy="8" r="1.4" /><circle cx="21" cy="8" r="1.4" /><circle cx="12" cy="4.5" r="1.4" />
        </svg>
      );
    case "huevo":
      return (
        <svg {...p} fill="currentColor">
          <path d="M12 2c4 0 7 5.5 7 10a7 7 0 0 1-14 0C5 7.5 8 2 12 2z" />
          <path d="M5.4 12.5c2 1.3 4.2 1.3 6.6 0 2.4 1.3 4.6 1.3 6.6 0" stroke="#fff" strokeWidth="1.2" fill="none" opacity=".7" />
          <path d="M6 9c2 1 3.5 1 6 0 2.5 1 4 1 6 0" stroke="#fff" strokeWidth="1" fill="none" opacity=".5" />
        </svg>
      );
    case "chispa":
    default:
      return (
        <svg {...p} fill="currentColor">
          <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
          <path d="M18.5 14l.8 3 3 .8-3 .8-.8 3-.8-3-3-.8 3-.8z" opacity=".7" />
        </svg>
      );
  }
}

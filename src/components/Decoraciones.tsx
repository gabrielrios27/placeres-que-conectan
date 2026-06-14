/** Decoraciones vectoriales de marca (SVG inline, livianas). */

export function RamaOlivo({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M10 110 C 60 90, 120 70, 190 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      {[
        [60, 84, -28],
        [95, 66, -22],
        [130, 48, -18],
        [162, 30, -14],
        [78, 96, 200],
        [112, 78, 205],
        [146, 60, 210],
      ].map(([x, y, r], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="16"
          ry="7"
          fill="currentColor"
          opacity="0.55"
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}
      {[
        [70, 70],
        [120, 52],
        [158, 36],
      ].map(([x, y], i) => (
        <circle key={`o${i}`} cx={x} cy={y} r="6.5" fill="currentColor" opacity="0.9" />
      ))}
    </svg>
  );
}

export function Aceituna({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <ellipse cx="20" cy="22" rx="12" ry="15" fill="currentColor" />
      <path
        d="M20 8 C 24 2, 32 2, 34 6"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="16" cy="17" rx="3" ry="5" fill="#ffffff" opacity="0.25" />
    </svg>
  );
}

export function GotaAceite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden="true">
      <path
        d="M12 2 C 12 2, 22 16, 22 22 A 10 10 0 1 1 2 22 C 2 16, 12 2, 12 2 Z"
        fill="currentColor"
      />
      <ellipse cx="9" cy="20" rx="2.5" ry="4" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}

/** Moño / lazo de regalo decorativo. Usa currentColor (color motif). */
export default function Mono({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 64 56" className={className} style={style} aria-hidden="true" fill="currentColor">
      {/* cintas que cuelgan */}
      <path d="M30 26c-4 8-9 16-11 24l13-10 13 10c-2-8-7-16-11-24z" opacity=".85" />
      {/* lazo izquierdo */}
      <path d="M32 24C20 12 4 12 4 23s16 12 28 3z" />
      {/* lazo derecho */}
      <path d="M32 24c12-12 28-12 28-1S44 35 32 27z" />
      {/* nudo central */}
      <rect x="27" y="19" width="10" height="12" rx="4" />
      {/* brillos */}
      <ellipse cx="18" cy="20" rx="4" ry="2.4" fill="#fff" opacity=".3" transform="rotate(-18 18 20)" />
      <ellipse cx="46" cy="20" rx="4" ry="2.4" fill="#fff" opacity=".3" transform="rotate(18 46 20)" />
    </svg>
  );
}

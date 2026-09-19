// Decoração do "estilo de ateliê" (cavalete + paleta de artista) — puramente visual, sem
// interação: usados por Canvas.jsx e Palette.jsx. Nunca recebem onClick nem afetam a leitura por
// teclado dos controles reais ao redor.

export function EaselLegs({ size = 96, className = '' }) {
  return (
    <svg viewBox="0 0 120 46" width={size} height={(size * 46) / 120} className={className} aria-hidden="true">
      <path d="M20 44 L58 4 L96 44" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 4 L58 44" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M30 30 L86 30" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

export function EaselLedge({ className = '' }) {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" width="100%" height="100%" className={className} aria-hidden="true">
      <rect x="0" y="0" width="200" height="16" fill="currentColor" />
      <rect x="0" y="3" width="200" height="2" fill="rgba(255,255,255,0.25)" />
      <rect x="0" y="12" width="200" height="2" fill="rgba(0,0,0,0.25)" />
      <circle cx="14" cy="8" r="1.6" fill="rgba(0,0,0,0.35)" />
      <circle cx="186" cy="8" r="1.6" fill="rgba(0,0,0,0.35)" />
    </svg>
  )
}

export function PaletteThumbHole({ size = 28, className = '' }) {
  return (
    <svg viewBox="0 0 28 20" width={size} height={(size * 20) / 28} className={className} aria-hidden="true">
      <ellipse cx="14" cy="10" rx="12" ry="8" fill="rgba(0,0,0,0.28)" />
      <ellipse cx="14" cy="9" rx="12" ry="8" fill="rgba(0,0,0,0.16)" />
    </svg>
  )
}

// Decoração da "paleta de artista" na seleção de cor — puramente visual, sem interação: usada por
// Palette.jsx. Nunca recebe onClick nem afeta a leitura por teclado dos controles reais ao redor.

export function PaletteThumbHole({ size = 28, className = '' }) {
  return (
    <svg viewBox="0 0 28 20" width={size} height={(size * 20) / 28} className={className} aria-hidden="true">
      <ellipse cx="14" cy="10" rx="12" ry="8" fill="rgba(0,0,0,0.28)" />
      <ellipse cx="14" cy="9" rx="12" ry="8" fill="rgba(0,0,0,0.16)" />
    </svg>
  )
}

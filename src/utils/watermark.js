const PALETTE_SHAPE = `
  <path d="M24 2 C36 2 46 10 46 18 C46 24 41 27 35 26 C31.5 25.3 28.5 27.5 29 31 C29.3 33.2 26.5 34.5 24 33.5 C10 28 2 22 2 14 C2 6 12 2 24 2 Z" fill="#DEB887" stroke="#92400E" stroke-width="1.8" />
  <ellipse cx="35" cy="29" rx="4.5" ry="3.2" fill="#fff" stroke="#92400E" stroke-width="1.2" />
  <circle cx="12" cy="10" r="3.4" fill="#EF4444" />
  <circle cx="22" cy="7" r="3.4" fill="#F97316" />
  <circle cx="32" cy="9" r="3.4" fill="#FACC15" />
  <circle cx="9" cy="19" r="3.4" fill="#22C55E" />
  <circle cx="17" cy="24" r="3.4" fill="#3B82F6" />
  <circle cx="26" cy="20" r="3.4" fill="#8B5CF6" />
`

const BRUSH_SHAPE = `
  <line x1="24" y1="4" x2="12" y2="16" stroke="#92400E" stroke-width="4.5" stroke-linecap="round" />
  <polygon points="12,16 18,14 20,20 8,24 5,18" fill="#4B5563" />
  <circle cx="6" cy="23" r="3.2" fill="#EC4899" />
`

function placed(shape, x, y, scale, rotate, opacity) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})" opacity="${opacity}">${shape}</g>`
}

function buildWatermarkTile() {
  const TILE = 260
  const items = [
    placed(PALETTE_SHAPE, 10, 20, 0.9, -15, 0.16),
    placed(BRUSH_SHAPE, 150, 10, 0.8, 30, 0.16),
    placed(PALETTE_SHAPE, 175, 130, 0.7, 20, 0.14),
    placed(BRUSH_SHAPE, 30, 150, 0.85, -40, 0.14),
    placed(PALETTE_SHAPE, 95, 200, 0.6, 10, 0.13),
    placed(BRUSH_SHAPE, 210, 205, 0.6, 100, 0.13),
  ].join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}">${items}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export const watermarkBackground = buildWatermarkTile()

import { hexToRgb } from './colorUtils'
import { hexToRgba } from './drawingUtils'

const DOT_SPACING = 12
const DOT_RADIUS = 3.5
const STRIPE_WIDTH = 7
const WHITE = [255, 255, 255, 255]

export function dotsPatternAt(x, y, rgb) {
  const cx = ((x % DOT_SPACING) + DOT_SPACING) % DOT_SPACING
  const cy = ((y % DOT_SPACING) + DOT_SPACING) % DOT_SPACING
  const dx = cx - DOT_SPACING / 2
  const dy = cy - DOT_SPACING / 2
  const isDot = dx * dx + dy * dy <= DOT_RADIUS * DOT_RADIUS
  return isDot ? [rgb[0], rgb[1], rgb[2], 255] : WHITE
}

export function stripesPatternAt(x, y, rgb) {
  const band = Math.floor((x + y) / STRIPE_WIDTH) % 2
  return band === 0 ? [rgb[0], rgb[1], rgb[2], 255] : WHITE
}

/**
 * Builds the value to pass as `fillColor` to `floodFill`: a fixed [r,g,b,a]
 * for 'solido', or a per-pixel function for 'bolinhas'/'listras'.
 */
export function buildFillColor(hex, pattern) {
  if (pattern === 'bolinhas' || pattern === 'listras') {
    const rgb = hexToRgb(hex) || [0, 0, 0]
    const patternFn = pattern === 'bolinhas' ? dotsPatternAt : stripesPatternAt
    return (x, y) => patternFn(x, y, rgb)
  }
  return hexToRgba(hex)
}

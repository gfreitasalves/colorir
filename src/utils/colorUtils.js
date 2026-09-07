export function isValidHex(value) {
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value)
}

export function normalizeHex(value) {
  if (!isValidHex(value)) return null
  let hex = value.toUpperCase()
  if (hex.length === 4) {
    hex = '#' + [...hex.slice(1)].map((c) => c + c).join('')
  }
  return hex
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex)
  if (!normalized) return null
  const int = parseInt(normalized.slice(1), 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

export function rgbToHex([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  )
}

export function colorsEqual(hexA, hexB) {
  return normalizeHex(hexA) === normalizeHex(hexB)
}

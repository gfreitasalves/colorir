import { hexToRgb } from './colorUtils'

export function getEventPoint(canvas, evt) {
  const rect = canvas.getBoundingClientRect()
  const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX
  const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  }
}

function colorAt(data, idx) {
  return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]]
}

function matches(data, idx, target, tolerance) {
  const dr = data[idx] - target[0]
  const dg = data[idx + 1] - target[1]
  const db = data[idx + 2] - target[2]
  const da = data[idx + 3] - target[3]
  return dr * dr + dg * dg + db * db + da * da <= tolerance * tolerance * 4
}

/**
 * Scanline flood fill. `sampleData` is used to decide region membership
 * (the merged, visible pixels); `targetData` is what actually gets painted.
 * They may be the same buffer.
 *
 * `fillColor` is either a fixed [r,g,b,a] (solid fill/erase) or a function
 * `(x, y) => [r,g,b,a]` evaluated per pixel (patterns like bolinhas/listras).
 */
export function floodFill(sampleData, targetData, width, height, startX, startY, fillColor, tolerance = 32) {
  const x0 = Math.floor(startX)
  const y0 = Math.floor(startY)
  if (x0 < 0 || y0 < 0 || x0 >= width || y0 >= height) return false

  const getFillColor = typeof fillColor === 'function' ? fillColor : () => fillColor

  const startIdx = (y0 * width + x0) * 4
  const target = colorAt(sampleData, startIdx)
  const startFill = getFillColor(x0, y0)
  if (
    target[0] === startFill[0] &&
    target[1] === startFill[1] &&
    target[2] === startFill[2] &&
    target[3] === startFill[3]
  ) {
    return false
  }

  const visited = new Uint8Array(width * height)
  const stack = [[x0, y0]]
  let changed = false

  while (stack.length) {
    const [x, y] = stack.pop()
    let west = x
    let east = x
    const rowOffset = y * width

    while (west > 0 && matches(sampleData, (rowOffset + west - 1) * 4, target, tolerance) && !visited[rowOffset + west - 1]) {
      west--
    }
    while (east < width - 1 && matches(sampleData, (rowOffset + east + 1) * 4, target, tolerance) && !visited[rowOffset + east + 1]) {
      east++
    }

    for (let i = west; i <= east; i++) {
      const pIdx = rowOffset + i
      if (visited[pIdx]) continue
      visited[pIdx] = 1
      const dataIdx = pIdx * 4
      const [r, g, b, a] = getFillColor(i, y)
      targetData[dataIdx] = r
      targetData[dataIdx + 1] = g
      targetData[dataIdx + 2] = b
      targetData[dataIdx + 3] = a
      changed = true

      if (y > 0) {
        const upIdx = pIdx - width
        if (!visited[upIdx] && matches(sampleData, upIdx * 4, target, tolerance)) stack.push([i, y - 1])
      }
      if (y < height - 1) {
        const downIdx = pIdx + width
        if (!visited[downIdx] && matches(sampleData, downIdx * 4, target, tolerance)) stack.push([i, y + 1])
      }
    }
  }

  return changed
}

export function hexToRgba(hex, opacity = 1) {
  const rgb = hexToRgb(hex) || [0, 0, 0]
  return [rgb[0], rgb[1], rgb[2], Math.round(opacity * 255)]
}

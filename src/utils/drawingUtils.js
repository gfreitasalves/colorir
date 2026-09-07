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

export function drawBrushSegment(ctx, from, to, { size, color, opacity, mode }) {
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = size
  ctx.globalAlpha = mode === 'eraser' ? 1 : opacity
  ctx.globalCompositeOperation = mode === 'eraser' ? 'destination-out' : 'source-over'
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(to.x, to.y, size / 2, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
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
 */
export function floodFill(sampleData, targetData, width, height, startX, startY, fillColorRgba, tolerance = 32) {
  const x0 = Math.floor(startX)
  const y0 = Math.floor(startY)
  if (x0 < 0 || y0 < 0 || x0 >= width || y0 >= height) return false

  const startIdx = (y0 * width + x0) * 4
  const target = colorAt(sampleData, startIdx)
  if (
    target[0] === fillColorRgba[0] &&
    target[1] === fillColorRgba[1] &&
    target[2] === fillColorRgba[2] &&
    target[3] === fillColorRgba[3]
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
      targetData[dataIdx] = fillColorRgba[0]
      targetData[dataIdx + 1] = fillColorRgba[1]
      targetData[dataIdx + 2] = fillColorRgba[2]
      targetData[dataIdx + 3] = fillColorRgba[3]
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

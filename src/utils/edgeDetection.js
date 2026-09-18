import { loadImage, fitDimensions } from './imageUtils'

const GX_KERNEL = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
const GY_KERNEL = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Sobel edge detection: converts an ImageData to a black-and-white line
 * drawing (black edges over a white background), suitable as a coloring
 * page outline.
 */
export function detectEdges(imageData, threshold = 60) {
  const { data, width, height } = imageData
  const gray = new Float32Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b
  }

  const out = new Uint8ClampedArray(data.length)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let gx = 0
      let gy = 0
      if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
        let k = 0
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const val = gray[(y + ky) * width + (x + kx)]
            gx += val * GX_KERNEL[k]
            gy += val * GY_KERNEL[k]
            k++
          }
        }
      }
      const magnitude = Math.sqrt(gx * gx + gy * gy)
      const value = magnitude > threshold ? 0 : 255
      const idx = (y * width + x) * 4
      out[idx] = value
      out[idx + 1] = value
      out[idx + 2] = value
      out[idx + 3] = 255
    }
  }

  return new ImageData(out, width, height)
}

/**
 * Full pipeline: reads a photo file chosen by the user, runs it through
 * Sobel edge detection, and returns a PNG data URL ready to use as a
 * coloring-page base image. Everything happens in the browser — the photo
 * is never uploaded anywhere.
 */
export async function photoFileToColoringPage(file, { maxDimension = 1000, threshold = 60 } = {}) {
  const sourceDataUrl = await readFileAsDataUrl(file)
  const img = await loadImage(sourceDataUrl)
  const { width, height } = fitDimensions(img.naturalWidth || img.width, img.naturalHeight || img.height, maxDimension)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  const imageData = ctx.getImageData(0, 0, width, height)
  const edges = detectEdges(imageData, threshold)
  ctx.putImageData(edges, 0, 0)

  return canvas.toDataURL('image/png')
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const MAX_DIMENSION = 1400

export function fitDimensions(naturalWidth, naturalHeight, maxDimension = MAX_DIMENSION) {
  const scale = Math.min(1, maxDimension / Math.max(naturalWidth, naturalHeight))
  return {
    width: Math.max(1, Math.round(naturalWidth * scale)),
    height: Math.max(1, Math.round(naturalHeight * scale)),
  }
}

export async function loadImageFileToCanvas(canvas, url) {
  const ctx = canvas.getContext('2d')
  const img = await loadImage(url)
  const { width, height } = fitDimensions(img.naturalWidth || img.width, img.naturalHeight || img.height)
  canvas.width = width
  canvas.height = height
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)
  return { ctx, width, height }
}

function mergedCanvas(baseCanvas, drawCanvas) {
  const merged = document.createElement('canvas')
  merged.width = baseCanvas.width
  merged.height = baseCanvas.height
  const ctx = merged.getContext('2d')
  ctx.drawImage(baseCanvas, 0, 0)
  ctx.drawImage(drawCanvas, 0, 0)
  return merged
}

export function getMergedImageData(baseCanvas, drawCanvas) {
  const merged = mergedCanvas(baseCanvas, drawCanvas)
  const ctx = merged.getContext('2d')
  return ctx.getImageData(0, 0, merged.width, merged.height)
}

function timestampSlug() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`
}

export function exportImage(baseCanvas, drawCanvas, titulo, format = 'png') {
  const merged = mergedCanvas(baseCanvas, drawCanvas)
  if (format === 'jpg' || format === 'jpeg') {
    const flattened = document.createElement('canvas')
    flattened.width = merged.width
    flattened.height = merged.height
    const fctx = flattened.getContext('2d')
    fctx.fillStyle = '#ffffff'
    fctx.fillRect(0, 0, flattened.width, flattened.height)
    fctx.drawImage(merged, 0, 0)
    var dataUrl = flattened.toDataURL('image/jpeg', 0.95)
    var ext = 'jpg'
  } else {
    dataUrl = merged.toDataURL('image/png')
    ext = 'png'
  }

  const slug = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `${slug}_${timestampSlug()}.${ext}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const DRAFT_PREFIX = 'colorir:draft:'
const HISTORY_KEY = 'colorir:colorHistory'

export function saveDraft(imageId, drawCanvas) {
  try {
    localStorage.setItem(DRAFT_PREFIX + imageId, drawCanvas.toDataURL('image/png'))
  } catch (err) {
    // localStorage full or unavailable: draft simply won't persist
  }
}

export function loadDraft(imageId) {
  try {
    return localStorage.getItem(DRAFT_PREFIX + imageId)
  } catch (err) {
    return null
  }
}

export function clearDraft(imageId) {
  try {
    localStorage.removeItem(DRAFT_PREFIX + imageId)
  } catch (err) {
    // ignore
  }
}

export function saveColorHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (err) {
    // ignore
  }
}

export function loadColorHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    return []
  }
}

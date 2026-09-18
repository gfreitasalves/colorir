import { useCallback, useEffect, useRef, useState } from 'react'
import { useUndo } from './useUndo'
import { floodFill } from '../utils/drawingUtils'
import { buildFillColor } from '../utils/patternUtils'
import {
  loadImageFileToCanvas,
  loadImage as loadImageAsset,
  getMergedImageData,
  saveDraft,
  clearDraft,
} from '../utils/imageUtils'
import { stickers } from '../data/stickers'

export function useCanvas() {
  const baseCanvasRef = useRef(null)
  const drawCanvasRef = useRef(null)
  const currentImageIdRef = useRef(null)
  const stickerImageCache = useRef({})
  const [imageSize, setImageSize] = useState({ width: 800, height: 800 })

  const { present, canUndo, canRedo, undo, redo, set, reset: resetHistory } = useUndo(null)

  const applySnapshot = useCallback((imageData) => {
    const drawCanvas = drawCanvasRef.current
    if (!drawCanvas || !imageData) return
    const ctx = drawCanvas.getContext('2d')
    ctx.putImageData(imageData, 0, 0)
  }, [])

  useEffect(() => {
    applySnapshot(present)
  }, [present, applySnapshot])

  const pushSnapshot = useCallback(() => {
    const drawCanvas = drawCanvasRef.current
    const ctx = drawCanvas.getContext('2d')
    const data = ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height)
    set(data)
    if (currentImageIdRef.current) saveDraft(currentImageIdRef.current, drawCanvas)
  }, [set])

  const loadImageToCanvas = useCallback(
    async (imageObj, draftDataUrl) => {
      currentImageIdRef.current = imageObj.id
      const baseCanvas = baseCanvasRef.current
      const drawCanvas = drawCanvasRef.current
      const { width, height } = await loadImageFileToCanvas(baseCanvas, imageObj.url)
      setImageSize({ width, height })
      drawCanvas.width = width
      drawCanvas.height = height
      const dctx = drawCanvas.getContext('2d')
      dctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height)
      if (draftDataUrl) {
        try {
          const img = await loadImageAsset(draftDataUrl)
          dctx.drawImage(img, 0, 0)
        } catch (err) {
          // corrupt/unavailable draft: continue with a blank draw layer
        }
      }
      const snapshot = dctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height)
      resetHistory(snapshot)
    },
    [resetHistory]
  )

  const fillAt = useCallback(
    (point, colorHex, pattern = 'solido') => {
      const drawCanvas = drawCanvasRef.current
      const baseCanvas = baseCanvasRef.current
      const dctx = drawCanvas.getContext('2d')
      const target = dctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height)

      if (!colorHex) {
        // Borracha: só há o que apagar onde já existe tinta (alpha > 0) na
        // camada de desenho — evita empilhar um snapshot sem efeito visual
        // ao clicar numa área ainda não colorida.
        const x = Math.floor(point.x)
        const y = Math.floor(point.y)
        if (x < 0 || y < 0 || x >= drawCanvas.width || y >= drawCanvas.height) return false
        const alphaIdx = (y * drawCanvas.width + x) * 4 + 3
        if (target.data[alphaIdx] === 0) return false
      }

      const sample = getMergedImageData(baseCanvas, drawCanvas)
      const fillColor = colorHex ? buildFillColor(colorHex, pattern) : [0, 0, 0, 0]
      const changed = floodFill(sample.data, target.data, drawCanvas.width, drawCanvas.height, point.x, point.y, fillColor, 40)
      if (changed) {
        dctx.putImageData(target, 0, 0)
        pushSnapshot()
      }
      return changed
    },
    [pushSnapshot]
  )

  const getStickerImage = useCallback((stickerId) => {
    if (!stickerImageCache.current[stickerId]) {
      const sticker = stickers.find((s) => s.id === stickerId)
      stickerImageCache.current[stickerId] = loadImageAsset(`data:image/svg+xml,${encodeURIComponent(sticker.svg)}`)
    }
    return stickerImageCache.current[stickerId]
  }, [])

  const stampAt = useCallback(
    async (point, stickerId) => {
      const drawCanvas = drawCanvasRef.current
      const dctx = drawCanvas.getContext('2d')
      const img = await getStickerImage(stickerId)
      const size = Math.max(28, Math.min(drawCanvas.width, drawCanvas.height) * 0.12)
      dctx.drawImage(img, point.x - size / 2, point.y - size / 2, size, size)
      pushSnapshot()
      return true
    },
    [getStickerImage, pushSnapshot]
  )

  const resetCanvas = useCallback(() => {
    const drawCanvas = drawCanvasRef.current
    const ctx = drawCanvas.getContext('2d')
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height)
    const snapshot = ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height)
    resetHistory(snapshot)
    if (currentImageIdRef.current) clearDraft(currentImageIdRef.current)
  }, [resetHistory])

  return {
    baseCanvasRef,
    drawCanvasRef,
    imageSize,
    loadImageToCanvas,
    fillAt,
    stampAt,
    resetCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}

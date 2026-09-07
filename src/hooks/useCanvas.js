import { useCallback, useEffect, useRef, useState } from 'react'
import { useUndo } from './useUndo'
import { floodFill, hexToRgba } from '../utils/drawingUtils'
import {
  loadImageFileToCanvas,
  loadImage as loadImageAsset,
  getMergedImageData,
  saveDraft,
  clearDraft,
} from '../utils/imageUtils'

export function useCanvas() {
  const baseCanvasRef = useRef(null)
  const drawCanvasRef = useRef(null)
  const currentImageIdRef = useRef(null)
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
    (point, colorHex) => {
      const drawCanvas = drawCanvasRef.current
      const baseCanvas = baseCanvasRef.current
      const dctx = drawCanvas.getContext('2d')
      const sample = getMergedImageData(baseCanvas, drawCanvas)
      const target = dctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height)
      const fillRgba = hexToRgba(colorHex)
      const changed = floodFill(sample.data, target.data, drawCanvas.width, drawCanvas.height, point.x, point.y, fillRgba, 40)
      if (changed) {
        dctx.putImageData(target, 0, 0)
        pushSnapshot()
      }
    },
    [pushSnapshot]
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
    resetCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}

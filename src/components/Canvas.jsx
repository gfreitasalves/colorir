import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getEventPoint } from '../utils/drawingUtils'

const MIN_ZOOM = 1
const MAX_ZOOM = 3

function brushCursor(color) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">` +
    `<line x1="27" y1="5" x2="13" y2="19" stroke="#78350F" stroke-width="5" stroke-linecap="round"/>` +
    `<polygon points="13,19 19,17 21,23 9,27 6,20" fill="#374151"/>` +
    `<circle cx="5" cy="27" r="3.2" fill="${color}" stroke="#1f2937" stroke-width="1"/>` +
    `</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 5 27, pointer`
}

function eraserCursor() {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">` +
    `<rect x="4" y="16" width="22" height="12" rx="3" fill="#F472B6" stroke="#831843" stroke-width="1.5"/>` +
    `<rect x="4" y="16" width="11" height="12" rx="3" fill="#FBCFE8" stroke="#831843" stroke-width="1.5"/>` +
    `</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 15 22, pointer`
}

function stickerCursor() {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">` +
    `<polygon points="14,2 17,10 26,10 18.5,15.5 21,24 14,19 7,24 9.5,15.5 2,10 11,10" fill="#FACC15" stroke="#CA8A04" stroke-width="1.5"/>` +
    `</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 14 14, pointer`
}

function cursorForTool(tool, color) {
  if (tool === 'borracha') return eraserCursor()
  if (tool === 'adesivo') return stickerCursor()
  return brushCursor(color)
}

export default function Canvas({ baseCanvasRef, drawCanvasRef, width, height, color, tool, zoom, onZoomChange, onFill }) {
  const scrollRef = useRef(null)
  const measureRef = useRef(null)
  const pinchRef = useRef(null)
  const [fitSize, setFitSize] = useState({ w: 0, h: 0 })
  const cursor = useMemo(() => cursorForTool(tool, color), [tool, color])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const updateSize = () => {
      const scale = Math.min(el.clientWidth / width, el.clientHeight / height)
      setFitSize({
        w: Math.max(0, Math.floor(width * scale)),
        h: Math.max(0, Math.floor(height * scale)),
      })
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [width, height])

  const size = { w: Math.round(fitSize.w * zoom), h: Math.round(fitSize.h * zoom) }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2
  }, [zoom, fitSize.w, fitSize.h])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onWheel = (e) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.15 : 0.15
      onZoomChange((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)))
    }

    const distance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinchRef.current = { startDist: distance(e.touches), startZoom: zoom }
      }
    }
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault()
        const scale = distance(e.touches) / pinchRef.current.startDist
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchRef.current.startZoom * scale))
        onZoomChange(() => next)
      }
    }
    const onTouchEnd = (e) => {
      if (e.touches.length < 2) pinchRef.current = null
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [zoom, onZoomChange])

  const handleClick = useCallback(
    (evt) => {
      const canvas = drawCanvasRef.current
      const point = getEventPoint(canvas, evt)
      onFill(point)
    },
    [drawCanvasRef, onFill]
  )

  return (
    <div
      ref={scrollRef}
      className="h-full w-full overflow-auto bg-gray-200 p-4 dark:bg-gray-900"
      style={{ touchAction: 'pan-x pan-y' }}
    >
      <div ref={measureRef} className="flex min-h-full min-w-full items-center justify-center">
        <div
          className="relative shrink-0 touch-none select-none shadow-lg"
          style={{ width: size.w, height: size.h, cursor }}
          onClick={handleClick}
        >
          <canvas ref={baseCanvasRef} className="absolute left-0 top-0 h-full w-full bg-white" />
          <canvas ref={drawCanvasRef} className="absolute left-0 top-0 h-full w-full" />
        </div>
      </div>
    </div>
  )
}

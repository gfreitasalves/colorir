import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getEventPoint } from '../utils/drawingUtils'

function brushCursor(color) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">` +
    `<line x1="27" y1="5" x2="13" y2="19" stroke="#78350F" stroke-width="5" stroke-linecap="round"/>` +
    `<polygon points="13,19 19,17 21,23 9,27 6,20" fill="#374151"/>` +
    `<circle cx="5" cy="27" r="3.2" fill="${color}" stroke="#1f2937" stroke-width="1"/>` +
    `</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 5 27, pointer`
}

export default function Canvas({ baseCanvasRef, drawCanvasRef, width, height, color, onFill }) {
  const measureRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const cursor = useMemo(() => brushCursor(color), [color])

  useEffect(() => {
    const el = measureRef.current
    if (!el) return
    const updateSize = () => {
      const scale = Math.min(el.clientWidth / width, el.clientHeight / height)
      setSize({
        w: Math.max(0, Math.floor(width * scale)),
        h: Math.max(0, Math.floor(height * scale)),
      })
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [width, height])

  const handleClick = useCallback(
    (evt) => {
      const canvas = drawCanvasRef.current
      const point = getEventPoint(canvas, evt)
      onFill(point)
    },
    [drawCanvasRef, onFill]
  )

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-gray-200 p-4 dark:bg-gray-900">
      <div ref={measureRef} className="flex h-full w-full items-center justify-center">
        <div
          className="relative touch-none select-none shadow-lg"
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

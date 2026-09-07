import { useCallback, useEffect, useRef, useState } from 'react'
import { getEventPoint } from '../utils/drawingUtils'

export default function Canvas({ baseCanvasRef, drawCanvasRef, width, height, onFill }) {
  const measureRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

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
          className="relative cursor-pointer touch-none select-none shadow-lg"
          style={{ width: size.w, height: size.h }}
          onClick={handleClick}
        >
          <canvas ref={baseCanvasRef} className="absolute left-0 top-0 h-full w-full bg-white" />
          <canvas ref={drawCanvasRef} className="absolute left-0 top-0 h-full w-full" />
        </div>
      </div>
    </div>
  )
}

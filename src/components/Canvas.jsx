import { useCallback, useRef, useState } from 'react'
import { getEventPoint } from '../utils/drawingUtils'

export default function Canvas({
  baseCanvasRef,
  drawCanvasRef,
  width,
  height,
  zoom,
  brush,
  onStartStroke,
  onContinueStroke,
  onEndStroke,
  onFill,
}) {
  const wrapperRef = useRef(null)
  const [cursor, setCursor] = useState(null)
  const isPointerDownRef = useRef(false)

  const handlePointerDown = useCallback(
    (evt) => {
      evt.preventDefault()
      const canvas = drawCanvasRef.current
      canvas.setPointerCapture?.(evt.pointerId)
      const point = getEventPoint(canvas, evt)
      isPointerDownRef.current = true
      if (brush.mode === 'fill') {
        onFill(point)
      } else {
        onStartStroke(point)
      }
    },
    [brush.mode, drawCanvasRef, onFill, onStartStroke]
  )

  const handlePointerMove = useCallback(
    (evt) => {
      const canvas = drawCanvasRef.current
      const point = getEventPoint(canvas, evt)
      if (evt.pointerType === 'mouse') {
        const rect = wrapperRef.current.getBoundingClientRect()
        setCursor({ x: evt.clientX - rect.left, y: evt.clientY - rect.top })
      }
      if (isPointerDownRef.current && brush.mode !== 'fill') {
        onContinueStroke(point)
      }
    },
    [brush.mode, drawCanvasRef, onContinueStroke]
  )

  const endInteraction = useCallback(
    (evt) => {
      if (isPointerDownRef.current) {
        onEndStroke()
      }
      isPointerDownRef.current = false
      if (evt?.type === 'pointerleave') setCursor(null)
    },
    [onEndStroke]
  )

  const cursorSize = Math.max(brush.size * zoom, 6)

  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto bg-gray-200 dark:bg-gray-900 p-4">
      <div
        ref={wrapperRef}
        className="relative touch-none select-none shadow-lg"
        style={{ width: width * zoom, height: height * zoom, cursor: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
        onPointerLeave={endInteraction}
      >
        <canvas
          ref={baseCanvasRef}
          width={width}
          height={height}
          className="absolute left-0 top-0 h-full w-full bg-white"
        />
        <canvas ref={drawCanvasRef} width={width} height={height} className="absolute left-0 top-0 h-full w-full" />
        {cursor && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border-2 border-gray-700 dark:border-gray-200 mix-blend-difference"
            style={{
              width: cursorSize,
              height: cursorSize,
              left: cursor.x - cursorSize / 2,
              top: cursor.y - cursorSize / 2,
              backgroundColor: brush.mode === 'eraser' ? 'transparent' : brush.color,
              opacity: brush.mode === 'eraser' ? 1 : brush.opacity,
            }}
          />
        )}
      </div>
    </div>
  )
}

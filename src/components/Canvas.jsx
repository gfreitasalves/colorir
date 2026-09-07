import { useCallback } from 'react'
import { getEventPoint } from '../utils/drawingUtils'

export default function Canvas({ baseCanvasRef, drawCanvasRef, width, height, onFill }) {
  const handleClick = useCallback(
    (evt) => {
      const canvas = drawCanvasRef.current
      const point = getEventPoint(canvas, evt)
      onFill(point)
    },
    [drawCanvasRef, onFill]
  )

  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto bg-gray-200 p-4 dark:bg-gray-900">
      <div
        className="relative aspect-square w-full max-w-[min(800px,100%)] cursor-pointer touch-none select-none shadow-lg"
        onClick={handleClick}
      >
        <canvas ref={baseCanvasRef} width={width} height={height} className="absolute left-0 top-0 h-full w-full bg-white" />
        <canvas ref={drawCanvasRef} width={width} height={height} className="absolute left-0 top-0 h-full w-full" />
      </div>
    </div>
  )
}

const MODES = [
  { id: 'brush', label: 'Pincel', icon: '🖌️' },
  { id: 'eraser', label: 'Borracha', icon: '🧽' },
  { id: 'fill', label: 'Balde', icon: '🪣' },
]

export default function BrushControls({ size, onSizeChange, opacity, onOpacityChange, mode, onModeChange }) {
  return (
    <aside className="flex h-full w-full flex-col gap-5 overflow-y-auto bg-white p-4 dark:bg-gray-800 md:w-56">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Modo de Pincel</h2>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onModeChange(m.id)}
              aria-pressed={mode === m.id}
              className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                mode === m.id
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span aria-hidden="true">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="brush-size" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Tamanho
          </label>
          <input
            type="number"
            min={5}
            max={100}
            value={size}
            onChange={(e) => onSizeChange(Math.min(100, Math.max(5, Number(e.target.value) || 5)))}
            className="w-16 rounded border border-gray-300 px-2 py-1 text-sm dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <input
          id="brush-size"
          type="range"
          min={5}
          max={100}
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-3 flex items-center justify-center rounded-md bg-gray-100 py-4 dark:bg-gray-700">
          <div
            className="rounded-full bg-gray-700 dark:bg-gray-200"
            style={{ width: size, height: size, maxWidth: '100%', maxHeight: 80 }}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="brush-opacity" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Opacidade
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-300">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          id="brush-opacity"
          type="range"
          min={0}
          max={100}
          value={Math.round(opacity * 100)}
          onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
          className="w-full"
        />
      </div>
    </aside>
  )
}

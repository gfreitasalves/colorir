import { presetColors } from '../data/presetColors'
import { colorsEqual } from '../utils/colorUtils'

function Swatch({ hex, selected, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label || hex}
      title={label || hex}
      onClick={onClick}
      className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
        selected ? 'border-brand-blue ring-2 ring-brand-blue ring-offset-2' : 'border-gray-300 dark:border-gray-600'
      }`}
      style={{ backgroundColor: hex }}
    />
  )
}

export default function Palette({ selectedColor, onSelectColor, history, onOpenPicker }) {
  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-y-auto bg-white p-4 dark:bg-gray-800 md:w-56">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Paleta de Cores</h2>
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((c) => (
            <Swatch
              key={c.id}
              hex={c.hex}
              label={c.nome}
              selected={colorsEqual(c.hex, selectedColor)}
              onClick={() => onSelectColor(c.hex)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenPicker}
        className="rounded-md border border-brand-blue px-3 py-2 text-sm font-medium text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
      >
        + Cor Personalizada
      </button>

      <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2 dark:bg-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-300">Atual</span>
        <div className="h-8 w-8 rounded-full border border-gray-300" style={{ backgroundColor: selectedColor }} />
        <span className="text-xs font-mono text-gray-700 dark:text-gray-200">{selectedColor}</span>
      </div>

      {history.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Histórico</h2>
          <div className="flex flex-wrap gap-2">
            {history.map((hex, i) => (
              <Swatch key={`${hex}-${i}`} hex={hex} selected={colorsEqual(hex, selectedColor)} onClick={() => onSelectColor(hex)} />
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

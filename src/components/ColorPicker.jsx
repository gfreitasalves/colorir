import { useState } from 'react'
import { hexToRgb, isValidHex, normalizeHex } from '../utils/colorUtils'

export default function ColorPicker({ initialColor, onConfirm, onCancel }) {
  const [hex, setHex] = useState(initialColor)
  const valid = isValidHex(hex)
  const rgb = valid ? hexToRgb(hex) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Selecionar Cor</h2>

        <div className="mb-4 flex items-center gap-3">
          <input
            type="color"
            aria-label="Seletor de cor"
            value={valid ? normalizeHex(hex) : '#000000'}
            onChange={(e) => setHex(e.target.value)}
            className="h-14 w-14 cursor-pointer rounded border border-gray-300"
          />
          <div className="h-14 flex-1 rounded border border-gray-300" style={{ backgroundColor: valid ? hex : 'transparent' }} />
        </div>

        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">HEX</label>
        <input
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#FF0000"
          className="mb-3 w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm dark:bg-gray-700 dark:text-gray-100"
        />

        <div className="mb-4 text-xs text-gray-500 dark:text-gray-300">
          RGB: {rgb ? rgb.join(', ') : '—'}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => onConfirm(normalizeHex(hex))}
            className="rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

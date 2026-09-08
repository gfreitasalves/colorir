import { PaletteIcon, BrushIcon } from './icons/PaletteBrushIcons'

function ToolButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  )
}

export default function Toolbar({ onBack, onUndo, canUndo, onRedo, canRedo, onReset, onSave }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
      <PaletteIcon size={26} className="hidden sm:block" />
      <ToolButton onClick={onBack} label="Voltar para a galeria">
        ← Galeria
      </ToolButton>

      <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-600" />

      <ToolButton onClick={onUndo} disabled={!canUndo} label="Desfazer (Ctrl+Z)">
        ↩ Desfazer
      </ToolButton>
      <ToolButton onClick={onRedo} disabled={!canRedo} label="Refazer (Ctrl+Shift+Z)">
        ↪ Refazer
      </ToolButton>

      <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-600" />

      <ToolButton onClick={onReset} label="Limpar / Restaurar imagem original">
        🗑 Limpar
      </ToolButton>

      <div className="ml-auto flex items-center gap-2">
        <BrushIcon size={24} className="hidden sm:block" />
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:brightness-105"
        >
          ⬇ Salvar
        </button>
      </div>
    </div>
  )
}

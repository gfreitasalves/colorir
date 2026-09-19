import { PaletteIcon, BrushIcon } from './icons/PaletteBrushIcons'
import { BackIcon, DownloadIcon } from './icons/ActionIcons'

export default function Toolbar({ onBack, onSave }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[var(--chrome-border)] bg-[var(--chrome-bg)] px-4 py-2">
      <div className="flex items-center gap-2">
        <PaletteIcon size={26} className="hidden sm:block" />
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para a galeria"
          title="Voltar para a galeria"
          className="flex items-center gap-1.5 rounded-md border border-[var(--chrome-border-strong)] px-3 py-2 text-sm font-medium text-[var(--chrome-text)] transition-colors hover:bg-[var(--chrome-muted-bg)]"
        >
          <BackIcon size={18} />
          Galeria
        </button>
      </div>

      <div className="flex items-center gap-2">
        <BrushIcon size={24} className="hidden sm:block" />
        <button
          type="button"
          onClick={onSave}
          aria-label="Salvar desenho"
          title="Salvar desenho"
          className="flex items-center gap-1.5 rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:brightness-105"
        >
          <DownloadIcon size={18} />
          Salvar
        </button>
      </div>
    </div>
  )
}

import { colorFamilies } from '../data/presetColors'
import { colorsEqual } from '../utils/colorUtils'
import { PaletteIcon, BrushIcon } from './icons/PaletteBrushIcons'
import { UndoIcon, RedoIcon, TrashIcon, BucketIcon, EraserIcon, StarIcon, ZoomIcon, CheckCircleIcon } from './icons/ActionIcons'

function Swatch({ hex, selected, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label || hex}
      title={label || hex}
      onClick={onClick}
      className={`h-9 w-9 shrink-0 rounded-full border-2 transition-transform hover:scale-110 ${
        selected ? 'border-brand-blue ring-2 ring-brand-blue ring-offset-2' : 'border-gray-300 dark:border-gray-600'
      }`}
      style={{ backgroundColor: hex }}
    />
  )
}

function StickerButton({ svg, nome, selected, onClick }) {
  return (
    <button
      type="button"
      aria-label={nome}
      title={nome}
      onClick={onClick}
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 bg-white p-2 transition-transform hover:scale-105 dark:bg-gray-700 ${
        selected ? 'border-brand-blue ring-2 ring-brand-blue ring-offset-2' : 'border-gray-300 dark:border-gray-600'
      }`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

function IconActionButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="rounded-md border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  )
}

const PATTERNS = [
  { id: 'solido', label: 'Sólido' },
  { id: 'bolinhas', label: 'Bolinhas' },
  { id: 'listras', label: 'Listras' },
]

const ZOOM_LEVELS = [1, 1.5, 2]

const TOOLS = [
  { id: 'balde', label: 'Balde de tinta', Icon: BucketIcon },
  { id: 'borracha', label: 'Borracha', Icon: EraserIcon },
  { id: 'adesivo', label: 'Adesivos', Icon: StarIcon },
]

export default function Palette({
  selectedColor,
  onSelectColor,
  history,
  onOpenPicker,
  tool,
  onToolChange,
  stickers,
  selectedSticker,
  onSelectSticker,
  selectedPattern,
  onSelectPattern,
  onUndo,
  canUndo,
  onRedo,
  canRedo,
  onReset,
  zoom,
  onZoomChange,
  onCelebrate,
}) {
  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-y-auto bg-white p-4 dark:bg-gray-800 md:w-56">
      <div>
        <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Ações</span>
        <div className="flex items-center gap-2" role="group" aria-label="Ações">
          <IconActionButton onClick={onUndo} disabled={!canUndo} label="Desfazer (Ctrl+Z)">
            <UndoIcon size={20} />
          </IconActionButton>
          <IconActionButton onClick={onRedo} disabled={!canRedo} label="Refazer (Ctrl+Shift+Z)">
            <RedoIcon size={20} />
          </IconActionButton>
          <IconActionButton onClick={onReset} label="Limpar / Restaurar imagem original">
            <TrashIcon size={20} />
          </IconActionButton>
        </div>
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Ferramenta</span>
        <div className="flex items-center gap-2" role="group" aria-label="Ferramenta">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onToolChange(t.id)}
              aria-pressed={tool === t.id}
              aria-label={t.label}
              title={t.label}
              className={`rounded-md border p-2 transition-colors ${
                tool === t.id
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <t.Icon size={20} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Zoom</span>
        <div className="flex items-center gap-1" role="group" aria-label="Zoom">
          <ZoomIcon size={16} className="mr-1 shrink-0 text-gray-400 dark:text-gray-500" />
          {ZOOM_LEVELS.map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => onZoomChange(z)}
              aria-pressed={Math.abs(zoom - z) < 0.05}
              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                Math.abs(zoom - z) < 0.05
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {Math.round(z * 100)}%
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onCelebrate}
        aria-label="Terminei de colorir"
        className="flex items-center justify-center gap-1.5 rounded-md border border-brand-blue px-3 py-2 text-sm font-medium text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
      >
        <CheckCircleIcon size={18} />
        Terminei!
      </button>

      <div className="h-px bg-gray-200 dark:bg-gray-700" />

      {tool === 'adesivo' ? (
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <PaletteIcon size={24} />
            Adesivos
            <BrushIcon size={18} />
          </h2>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Escolha um adesivo e toque no desenho para carimbá-lo.</p>
          <div className="flex flex-wrap gap-2">
            {stickers.map((s) => (
              <StickerButton
                key={s.id}
                svg={s.svg}
                nome={s.nome}
                selected={selectedSticker === s.id}
                onClick={() => onSelectSticker(s.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div>
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <PaletteIcon size={24} />
              Paleta de Cores
              <BrushIcon size={18} />
            </h2>
            <div className="flex flex-col gap-2">
              {colorFamilies.map((family) => (
                <div key={family.id} className="flex gap-2">
                  {family.cores.map((c) => (
                    <Swatch key={c.hex} hex={c.hex} label={c.nome} selected={colorsEqual(c.hex, selectedColor)} onClick={() => onSelectColor(c.hex)} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Preenchimento</span>
            <div className="flex gap-1" role="group" aria-label="Padrão de preenchimento">
              {PATTERNS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectPattern(p.id)}
                  aria-pressed={selectedPattern === p.id}
                  className={`rounded-md border px-2 py-1 text-xs font-medium ${
                    selectedPattern === p.id
                      ? 'border-brand-blue bg-brand-blue text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {p.label}
                </button>
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
        </>
      )}
    </aside>
  )
}

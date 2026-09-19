import { colorFamilies } from '../data/presetColors'
import { colorsEqual } from '../utils/colorUtils'
import { PaletteIcon, BrushIcon } from './icons/PaletteBrushIcons'
import { PaletteThumbHole } from './icons/StudioDecorIcons'
import { UndoIcon, RedoIcon, TrashIcon, BucketIcon, EraserIcon, StarIcon, ZoomIcon, CheckCircleIcon } from './icons/ActionIcons'

function Swatch({ hex, selected, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label || hex}
      title={label || hex}
      onClick={onClick}
      className={`studio-paint-blob h-9 w-9 shrink-0 border-2 transition-transform hover:scale-110 ${
        selected ? 'border-[var(--chrome-accent)] ring-2 ring-[var(--chrome-accent)] ring-offset-2' : 'border-black/10'
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
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 bg-[var(--chrome-bg)] p-2 transition-transform hover:scale-105 ${
        selected ? 'border-[var(--chrome-accent)] ring-2 ring-[var(--chrome-accent)] ring-offset-2' : 'border-[var(--chrome-border-strong)]'
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
      className="rounded-md border border-[var(--chrome-border-strong)] p-2 text-[var(--chrome-text)] transition-colors hover:bg-[var(--chrome-muted-bg)] disabled:cursor-not-allowed disabled:opacity-40"
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
    <aside className="flex h-full w-full flex-col gap-4 overflow-y-auto bg-[var(--chrome-bg)] p-4 md:w-56">
      {tool === 'adesivo' ? (
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--chrome-text)]">
            <PaletteIcon size={24} />
            Adesivos
            <BrushIcon size={18} />
          </h2>
          <p className="mb-3 text-xs text-[var(--chrome-text-muted)]">Escolha um adesivo e toque no desenho para carimbá-lo.</p>
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
        <div className="studio-wood-surface studio-palette-frame relative p-4 pb-6">
          <PaletteThumbHole className="pointer-events-none absolute -right-1 top-2 opacity-70" size={30} />

          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--studio-wood-text)]">
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

          <div className="mt-3">
            <span className="mb-1 block text-xs font-medium text-[var(--studio-wood-text)] opacity-80">Preenchimento</span>
            <div className="flex gap-1" role="group" aria-label="Padrão de preenchimento">
              {PATTERNS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectPattern(p.id)}
                  aria-pressed={selectedPattern === p.id}
                  className={`rounded-md border px-2 py-1 text-xs font-medium ${
                    selectedPattern === p.id
                      ? 'border-[var(--chrome-accent)] bg-[var(--chrome-accent)] text-[var(--chrome-accent-text)]'
                      : 'border-black/20 bg-white/70 text-[var(--studio-wood-text)] hover:bg-white/90 dark:border-white/20 dark:bg-black/25 dark:hover:bg-black/40'
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
            className="mt-3 rounded-md border border-[var(--chrome-accent)] bg-white/80 px-3 py-2 text-sm font-medium text-[var(--chrome-accent)] transition-colors hover:bg-[var(--chrome-accent)] hover:text-[var(--chrome-accent-text)] dark:bg-black/25"
          >
            + Cor Personalizada
          </button>

          <div className="mt-3 flex items-center gap-2 rounded-md bg-white/70 p-2 dark:bg-black/25">
            <span className="text-xs text-[var(--studio-wood-text)] opacity-80">Atual</span>
            <div className="studio-paint-blob h-8 w-8 border border-black/10" style={{ backgroundColor: selectedColor }} />
            <span className="text-xs font-mono text-[var(--studio-wood-text)]">{selectedColor}</span>
          </div>

          {history.length > 0 && (
            <div className="mt-3">
              <h2 className="mb-2 text-sm font-semibold text-[var(--studio-wood-text)]">Histórico</h2>
              <div className="flex flex-wrap gap-2">
                {history.map((hex, i) => (
                  <Swatch key={`${hex}-${i}`} hex={hex} selected={colorsEqual(hex, selectedColor)} onClick={() => onSelectColor(hex)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="h-px bg-[var(--chrome-border)]" />

      <div>
        <span className="mb-1 block text-xs font-medium text-[var(--chrome-text-muted)]">Ações</span>
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
        <span className="mb-1 block text-xs font-medium text-[var(--chrome-text-muted)]">Ferramenta</span>
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
                  ? 'border-[var(--chrome-accent)] bg-[var(--chrome-accent)] text-[var(--chrome-accent-text)]'
                  : 'border-[var(--chrome-border-strong)] text-[var(--chrome-text)] hover:bg-[var(--chrome-muted-bg)]'
              }`}
            >
              <t.Icon size={20} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium text-[var(--chrome-text-muted)]">Zoom</span>
        <div className="flex items-center gap-1" role="group" aria-label="Zoom">
          <ZoomIcon size={16} className="mr-1 shrink-0 text-[var(--chrome-text-muted)]" />
          {ZOOM_LEVELS.map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => onZoomChange(z)}
              aria-pressed={Math.abs(zoom - z) < 0.05}
              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                Math.abs(zoom - z) < 0.05
                  ? 'border-[var(--chrome-accent)] bg-[var(--chrome-accent)] text-[var(--chrome-accent-text)]'
                  : 'border-[var(--chrome-border-strong)] text-[var(--chrome-text)] hover:bg-[var(--chrome-muted-bg)]'
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
        className="flex items-center justify-center gap-1.5 rounded-md border border-[var(--chrome-accent)] px-3 py-2 text-sm font-medium text-[var(--chrome-accent)] transition-colors hover:bg-[var(--chrome-accent)] hover:text-[var(--chrome-accent-text)]"
      >
        <CheckCircleIcon size={18} />
        Terminei!
      </button>
    </aside>
  )
}

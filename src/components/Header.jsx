import { PaletteIcon, BrushIcon } from './icons/PaletteBrushIcons'
import ThemePicker from './ThemePicker'

export default function Header({ view, categoryTitle, imageTitle, darkMode, onToggleDarkMode, muted, onToggleMute, theme, onSelectTheme }) {
  const crumbs = ['Galeria']
  if (view === 'editor') {
    if (categoryTitle) crumbs.push(categoryTitle)
    if (imageTitle) crumbs.push(imageTitle)
  }
  return (
    <header className="flex items-center justify-between border-b border-[var(--chrome-border)] bg-[var(--chrome-bg)] px-4 py-3">
      <div className="flex items-center gap-2">
        <PaletteIcon size={30} />
        <div>
          <h1 className="text-lg font-bold text-[var(--chrome-text)]">
            Colorir<span className="text-brand-blue">App</span>
          </h1>
          <p className="text-xs text-[var(--chrome-text-muted)]">{crumbs.join(' > ')}</p>
        </div>
        <BrushIcon size={22} className="ml-1 hidden sm:block" />
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <ThemePicker theme={theme} onSelectTheme={onSelectTheme} />
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Ativar sons' : 'Silenciar sons'}
          title={muted ? 'Ativar sons' : 'Silenciar sons'}
          className="rounded-md border border-[var(--chrome-border-strong)] px-2 py-2 text-sm text-[var(--chrome-text)] sm:px-3"
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          type="button"
          onClick={onToggleDarkMode}
          aria-label="Alternar modo escuro"
          title="Alternar modo escuro"
          className="rounded-md border border-[var(--chrome-border-strong)] px-2 py-2 text-sm text-[var(--chrome-text)] sm:px-3"
        >
          {darkMode ? '☀️' : '🌙'}
          <span className="hidden sm:inline">{darkMode ? ' Claro' : ' Escuro'}</span>
        </button>
      </div>
    </header>
  )
}

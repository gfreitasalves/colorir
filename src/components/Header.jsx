import { PaletteIcon, BrushIcon } from './icons/PaletteBrushIcons'

export default function Header({ view, categoryTitle, imageTitle, darkMode, onToggleDarkMode }) {
  const crumbs = ['Galeria']
  if (view === 'editor') {
    if (categoryTitle) crumbs.push(categoryTitle)
    if (imageTitle) crumbs.push(imageTitle)
  }
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <PaletteIcon size={30} />
        <div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Colorir<span className="text-brand-blue">App</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{crumbs.join(' > ')}</p>
        </div>
        <BrushIcon size={22} className="ml-1 hidden sm:block" />
      </div>
      <button
        type="button"
        onClick={onToggleDarkMode}
        aria-label="Alternar modo escuro"
        title="Alternar modo escuro"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:text-gray-100"
      >
        {darkMode ? '☀️ Claro' : '🌙 Escuro'}
      </button>
    </header>
  )
}

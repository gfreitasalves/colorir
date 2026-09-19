import { interfaceThemes } from '../data/interfaceThemes'

export default function ThemePicker({ theme, onSelectTheme }) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1" role="group" aria-label="Tema de cor da interface">
      {interfaceThemes.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelectTheme(t.id)}
          aria-pressed={theme === t.id}
          aria-label={`Tema ${t.nome}`}
          title={`Tema ${t.nome}`}
          className={`h-6 w-6 shrink-0 rounded-full border-2 transition-transform hover:scale-110 sm:h-7 sm:w-7 ${
            theme === t.id ? 'border-[var(--chrome-text)] ring-2 ring-[var(--chrome-accent)] ring-offset-1' : 'border-transparent'
          }`}
          style={{ backgroundColor: t.corDestaque }}
        />
      ))}
    </div>
  )
}

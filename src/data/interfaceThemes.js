// Temas de cor da interface (Header, Toolbar, Palette, botões) — não confundir com
// `presetColors.js`, que é a paleta usada para colorir os desenhos.
export const interfaceThemes = [
  { id: 'padrao', nome: 'Padrão', corDestaque: '#2563eb' },
  { id: 'oceano', nome: 'Oceano', corDestaque: '#0284c7' },
  { id: 'flor', nome: 'Flor', corDestaque: '#c026d3' },
  { id: 'floresta', nome: 'Floresta', corDestaque: '#16a34a' },
]

export const DEFAULT_THEME_ID = 'padrao'

export function isValidThemeId(id) {
  return interfaceThemes.some((theme) => theme.id === id)
}

import { useEffect, useState } from 'react'
import { DEFAULT_THEME_ID, isValidThemeId } from '../data/interfaceThemes'

const STORAGE_KEY = 'colorir:theme'

export function useInterfaceTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return isValidThemeId(saved) ? saved : DEFAULT_THEME_ID
    } catch {
      return DEFAULT_THEME_ID
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore persistence failures
    }
  }, [theme])

  return { theme, setTheme }
}

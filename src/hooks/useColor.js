import { useCallback, useEffect, useState } from 'react'
import { colorFamilies } from '../data/presetColors'
import { loadColorHistory, saveColorHistory } from '../utils/imageUtils'
import { colorsEqual, normalizeHex } from '../utils/colorUtils'

const MAX_HISTORY = 8

export function useColor() {
  const [selectedColor, setSelectedColor] = useState(colorFamilies[0].cores[1].hex)
  const [history, setHistory] = useState(() => loadColorHistory())
  const [customColors, setCustomColors] = useState([])

  useEffect(() => {
    saveColorHistory(history)
  }, [history])

  const selectColor = useCallback((hex) => {
    const normalized = normalizeHex(hex)
    if (!normalized) return
    setSelectedColor(normalized)
    setHistory((prev) => {
      const withoutDuplicate = prev.filter((c) => !colorsEqual(c, normalized))
      return [normalized, ...withoutDuplicate].slice(0, MAX_HISTORY)
    })
  }, [])

  const addCustomColor = useCallback(
    (hex) => {
      const normalized = normalizeHex(hex)
      if (!normalized) return
      setCustomColors((prev) => (prev.some((c) => colorsEqual(c, normalized)) ? prev : [normalized, ...prev]))
      selectColor(normalized)
    },
    [selectColor]
  )

  return { selectedColor, selectColor, history, customColors, addCustomColor }
}

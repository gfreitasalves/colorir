import { useCallback, useState } from 'react'

const MAX_HISTORY = 20

export function useUndo(initialPresent = null) {
  const [state, setState] = useState({ past: [], present: initialPresent, future: [] })

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  const undo = useCallback(() => {
    setState((current) => {
      if (current.past.length === 0) return current
      const previous = current.past[current.past.length - 1]
      const newPast = current.past.slice(0, -1)
      return { past: newPast, present: previous, future: [current.present, ...current.future] }
    })
  }, [])

  const redo = useCallback(() => {
    setState((current) => {
      if (current.future.length === 0) return current
      const next = current.future[0]
      const newFuture = current.future.slice(1)
      return { past: [...current.past, current.present], present: next, future: newFuture }
    })
  }, [])

  const set = useCallback((newPresent) => {
    setState((current) => {
      const newPast = [...current.past, current.present].slice(-MAX_HISTORY)
      return { past: newPast, present: newPresent, future: [] }
    })
  }, [])

  const reset = useCallback((newPresent) => {
    setState({ past: [], present: newPresent, future: [] })
  }, [])

  return { present: state.present, canUndo, canRedo, undo, redo, set, reset }
}

import { useCallback, useEffect, useRef, useState } from 'react'

const MUTED_KEY = 'colorir:muted'
const FANFARE_NOTES = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6

export function useSound() {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTED_KEY) === 'true'
    } catch {
      return false
    }
  })
  const audioCtxRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(MUTED_KEY, String(muted))
    } catch {
      // ignore persistence failures
    }
  }, [muted])

  const getAudioContext = useCallback(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContextClass()
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume()
    return audioCtxRef.current
  }, [])

  const playTone = useCallback(
    (frequency, duration, startDelay = 0) => {
      const ctx = getAudioContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = frequency
      const startTime = ctx.currentTime + startDelay
      gain.gain.setValueAtTime(0.15, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + duration)
    },
    [getAudioContext]
  )

  const playBlip = useCallback(() => {
    if (muted) return
    playTone(500 + Math.random() * 250, 0.12)
  }, [muted, playTone])

  const playFanfare = useCallback(() => {
    if (muted) return
    FANFARE_NOTES.forEach((freq, i) => playTone(freq, 0.25, i * 0.15))
  }, [muted, playTone])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  return { muted, toggleMute, playBlip, playFanfare }
}

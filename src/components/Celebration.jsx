import { useEffect } from 'react'

const CONFETTI_COLORS = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6']
const CONFETTI_COUNT = 24
const AUTO_CLOSE_MS = 3000

export default function Celebration({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_CLOSE_MS)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      role="status"
      aria-live="polite"
    >
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 h-2 w-2 animate-confetti-fall rounded-sm"
          style={{
            left: `${(i * 97) % 100}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${(i % 8) * 0.15}s`,
            animationDuration: `${1.8 + (i % 5) * 0.3}s`,
          }}
        />
      ))}
      <div className="rounded-2xl bg-white/95 px-8 py-6 text-center shadow-2xl dark:bg-gray-800/95">
        <p className="text-4xl">🎉</p>
        <p className="mt-2 text-xl font-bold text-gray-800 dark:text-gray-100">Muito bem!</p>
      </div>
    </div>
  )
}

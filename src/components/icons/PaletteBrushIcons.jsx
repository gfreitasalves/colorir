export function PaletteIcon({ size = 32, className = '' }) {
  return (
    <svg
      viewBox="0 0 48 36"
      width={size}
      height={(size * 36) / 48}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 2 C36 2 46 10 46 18 C46 24 41 27 35 26 C31.5 25.3 28.5 27.5 29 31 C29.3 33.2 26.5 34.5 24 33.5 C10 28 2 22 2 14 C2 6 12 2 24 2 Z"
        fill="#DEB887"
        stroke="#92400E"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <ellipse cx="35" cy="29" rx="4.5" ry="3.2" fill="#fff" stroke="#92400E" strokeWidth="1.2" />
      <circle cx="12" cy="10" r="3.4" fill="#EF4444" />
      <circle cx="22" cy="7" r="3.4" fill="#F97316" />
      <circle cx="32" cy="9" r="3.4" fill="#FACC15" />
      <circle cx="9" cy="19" r="3.4" fill="#22C55E" />
      <circle cx="17" cy="24" r="3.4" fill="#3B82F6" />
      <circle cx="26" cy="20" r="3.4" fill="#8B5CF6" />
    </svg>
  )
}

export function BrushIcon({ size = 28, className = '' }) {
  return (
    <svg
      viewBox="0 0 28 32"
      width={size}
      height={(size * 32) / 28}
      className={className}
      aria-hidden="true"
    >
      <line x1="24" y1="4" x2="12" y2="16" stroke="#92400E" strokeWidth="4.5" strokeLinecap="round" />
      <polygon points="12,16 18,14 20,20 8,24 5,18" fill="#4B5563" />
      <circle cx="6" cy="23" r="3.2" fill="#EC4899" />
    </svg>
  )
}

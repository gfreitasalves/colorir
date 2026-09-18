function Icon({ children, size = 20, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function UndoIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
    </Icon>
  )
}

export function RedoIcon(props) {
  return (
    <Icon {...props}>
      <path d="M15 14l5-5-5-5" />
      <path d="M20 9H10a6 6 0 0 0 0 12h3" />
    </Icon>
  )
}

export function TrashIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </Icon>
  )
}

export function BucketIcon(props) {
  return (
    <Icon {...props}>
      <ellipse cx="11" cy="7" rx="7" ry="2.3" />
      <path d="M4 7l1.4 10.6A2 2 0 0 0 7.4 19h7.2a2 2 0 0 0 2-1.6L18 7.6" />
      <path d="M20 15c1 1.3 1 2.3 0 3.5" />
    </Icon>
  )
}

export function EraserIcon(props) {
  return (
    <Icon {...props}>
      <path d="M18 13l-7 7H7l-3-3a2 2 0 0 1 0-2.8L14 4.2a2 2 0 0 1 2.8 0l3.5 3.5a2 2 0 0 1 0 2.8L18 13Z" />
      <path d="M9 20h11" />
    </Icon>
  )
}

export function StarIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.8 1.4 6.9L12 17.6 5.9 20.8l1.4-6.9L2.2 9.1l6.9-.8L12 2Z" />
    </Icon>
  )
}

export function ZoomIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="10" cy="10" r="6" />
      <path d="M20 20l-5.5-5.5" />
    </Icon>
  )
}

export function CheckCircleIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5.5" />
    </Icon>
  )
}

export function DownloadIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 4v11" />
      <path d="M8 11l4 4 4-4" />
      <path d="M5 19h14" />
    </Icon>
  )
}

export function BackIcon(props) {
  return (
    <Icon {...props}>
      <path d="M15 5l-7 7 7 7" />
    </Icon>
  )
}

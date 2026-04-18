import type { CursorPosition } from '../model/types'

interface RemoteCursorProps {
  userName: string
  position: CursorPosition
  color: string
  isIdle?: boolean
}

export function RemoteCursor({
  userName,
  position,
  color,
  isIdle = false,
}: RemoteCursorProps) {
  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-2px, -2px)',
        opacity: isIdle ? 0.5 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M5 3l14 9-6 1-3 5-5-15z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      <div
        className="mt-1 whitespace-nowrap rounded px-2 py-1 text-11 text-on-color"
        style={{ backgroundColor: color }}
      >
        {userName}
      </div>
    </div>
  )
}

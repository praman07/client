import { useCollaborativeCursors } from '../hooks/use-collaborative-cursors'
import { renderCursor } from '../lib/cursor-renderer'

export function CursorOverlay({ boardId }: { boardId: string }) {
  const { cursors } = useCollaborativeCursors(boardId)
  
  if (cursors.length === 0) return null
  
  return (
    <svg
      className="absolute inset-0 pointer-events-none z-40"
      style={{ width: '100%', height: '100%' }}
    >
      {cursors.map((cursor) => {
        const { path, label, transform } = renderCursor({
          position: cursor.position,
          color: cursor.color,
          userName: cursor.userName,
        })
        
        return (
          <g key={cursor.userId} transform={transform}>
            {/* Cursor icon */}
            <path
              d={path}
              fill={cursor.color}
              stroke="white"
              strokeWidth="1"
            />
            
            {/* User name label */}
            <text
              x="20"
              y="10"
              fill={cursor.color}
              fontSize="12"
              fontWeight="500"
              className="drop-shadow"
            >
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

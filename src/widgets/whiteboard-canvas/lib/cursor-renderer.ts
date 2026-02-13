import type { CursorPosition } from '@/entities/whiteboard-presence'

interface CursorRenderOptions {
  position: CursorPosition
  color: string
  userName: string
}

/**
 * Render SVG cursor element
 *
 * Returns SVG path data for cursor icon + label
 */
export function renderCursor(options: CursorRenderOptions): {
  path: string
  label: string
  transform: string
} {
  const { position, color, userName } = options

  // SVG cursor path (pointer shape)
  const path = `M 0 0 L 0 20 L 5 15 L 10 25 L 13 23 L 8 13 L 15 13 Z`

  // Position transform
  const transform = `translate(${position.x}, ${position.y})`

  return {
    path,
    label: userName,
    transform,
  }
}

/**
 * Get cursor color for user
 *
 * Deterministic color assignment based on userId
 */
export function getCursorColor(userId: string): string {
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Sky Blue
  ]

  // Hash userId to index
  const hash = userId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)

  return colors[hash % colors.length]
}

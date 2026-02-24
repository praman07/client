const CURSOR_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
]

/**
 * Deterministically assign a color to a user based on their ID.
 * Same palette and algorithm as whiteboard-presence — consistency across
 * board and page sessions for the same user.
 *
 * @internal Used only inside slice reducers — not exported publicly.
 */
export function assignColor(userId: string): string {
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length]
}

/**
 * Fractional index midpoint calculator.
 *
 * Computes a new position value that slots between two existing positions
 * without renumbering all items. Used for both issue card drag and column reorder.
 *
 * Rules:
 *   - Insert between prev and next → (prev + next) / 2
 *   - Insert at the top (no prev) → next / 2
 *   - Insert at the bottom (no next) → prev + 1.0
 *   - Empty list → 1.0
 *
 * @pure — no side effects, safe to unit test in isolation
 * @layer Features
 */
export function calculateNewPosition(prev?: number, next?: number): number {
  if (prev === undefined && next === undefined) return 1.0
  if (prev === undefined) return next! / 2
  if (next === undefined) return prev + 1.0
  return (prev + next) / 2
}

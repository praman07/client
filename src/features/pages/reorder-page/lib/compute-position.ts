/**
 * Computes a numeric Float position for placing a page between two siblings.
 *
 * The server stores position as a Float @default(0) — no fractional-indexing
 * string library needed. Simple numeric midpoint arithmetic suffices.
 *
 * @param before - position of the sibling directly above drop target (null = insert at start)
 * @param after  - position of the sibling directly below drop target (null = insert at end)
 *
 * Examples:
 *   computeNewPosition(null, null)  → 0        (only child)
 *   computeNewPosition(null, 1)     → 0        (before first: after - 1)
 *   computeNewPosition(1, null)     → 2        (after last: before + 1)
 *   computeNewPosition(1, 3)        → 2        (midpoint)
 *   computeNewPosition(1, 1.5)      → 1.25     (narrow gap, still precise)
 */
export function computeNewPosition(
  before: number | null,
  after: number | null,
): number {
  if (before === null && after === null) return 0
  if (before === null) return after! - 1
  if (after === null) return before + 1
  return (before + after) / 2
}

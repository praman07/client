import { useCallback, useState } from 'react'

/**
 * Manages the "Visual Window" of sequences we want to render.
 *
 * Invariants:
 * - visualMinSequence >= 0
 * - visualMaxSequence >= visualMinSequence
 * - Expands upwards on scroll up (loadOlder)
 * - Expands downwards on scroll down (loadNewer) - optional if we want to drop top
 */
export function useWindowController(
  initialMin: number = 0,
  initialMax: number = Infinity,
) {
  const [minSeq, setMinSeq] = useState(initialMin)
  const [maxSeq, setMaxSeq] = useState(initialMax)

  // Expand window upwards (load older history)
  const loadOlder = useCallback((amount: number = 50) => {
    setMinSeq((prev) => Math.max(0, prev - amount))
  }, [])

  // Expand window downwards (load newer messages)
  // Useful if we are jumping to a search result or valid anchor
  const loadNewer = useCallback((amount: number = 50) => {
    setMaxSeq((prev) => (prev === Infinity ? Infinity : prev + amount))
  }, [])

  // Reset window to bottom focus
  const resetToBottom = useCallback(() => {
    // If we assume sequential IDs, "Infinity" covers the bottom.
    // Ideally we'd know the latest sequence, but Infinity works for "Everything new".
    setMinSeq(Math.max(0, initialMin)) // Reset to default lookback
    setMaxSeq(Infinity)
  }, [initialMin])

  return {
    minSequence: minSeq,
    maxSequence: maxSeq,
    loadOlder,
    loadNewer,
    resetToBottom,
  }
}

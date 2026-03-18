/**
 * BoardContext — shared DnD state for the issues board.
 * Consumed by IssueCard to know if it's the active (dragging) card,
 * enabling the ghost + overlay separation pattern.
 *
 * @layer Widgets (internal)
 */
import { createContext } from 'react'

export interface BoardContextValue {
  /** ID of the card currently being dragged, or null. */
  activeCardId: string | null
}

export const BoardContext = createContext<BoardContextValue>({
  activeCardId: null,
})

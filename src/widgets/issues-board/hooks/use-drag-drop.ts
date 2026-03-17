/**
 * useDragDrop — Orchestrates all dnd-kit drag events for the Kanban board.
 *
 * Three-phase flow:
 *   onDragStart → set activeCardId (shows overlay card)
 *   onDragOver  → optimistic Redux move when column changes (live visual jump)
 *   onDragEnd   → fire server mutation with final position, clear activeCardId
 *
 * Cross-column drag → useMoveIssue
 * Same-column drag  → useReorderIssue
 * calculateNewPosition → fractional index midpoint
 *
 * @layer Widgets
 */
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import type { AppDispatch } from '@/app/store'
import {
  moveIssue as moveIssueAction,
  reorderIssue as reorderIssueAction,
  selectIssues,
} from '@/entities/issue'
import {
  calculateNewPosition,
  useMoveIssue,
  useReorderIssue,
} from '@/features/issues/drag-issue'

export function useDragDrop(projectId: string) {
  const dispatch = useDispatch<AppDispatch>()
  const issues = useSelector(selectIssues)
  const { mutate: moveIssue } = useMoveIssue(projectId)
  const { mutate: reorderIssue } = useReorderIssue(projectId)

  // Keep a stable ref so callbacks always see the freshest issues array
  const issuesRef = useRef(issues)
  issuesRef.current = issues

  // Captures the ORIGINAL status of the dragged card at drag-start.
  // We must record this BEFORE onDragOver mutates Redux — otherwise by the
  // time onDragEnd runs, draggedIssue.status.id has already changed to the
  // target column and the cross-column check would always be false.
  const sourceStatusIdRef = useRef<string | null>(null)

  // ── Active card state (shared via BoardContext) ────────────────────────────
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  // ── onDragStart ────────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const draggedId = event.active.id.toString()

      // Belt-and-suspenders: if a drag is already active (multi-touch race,
      // browser quirk, etc.), reject the second one immediately.
      // dnd-kit enforces single-drag at the sensor level, but this explicit
      // guard means our own state can never end up with two simultaneous dragged cards.
      if (activeCardId !== null && activeCardId !== draggedId) {
        return
      }

      setActiveCardId(draggedId)
      // Snapshot original status BEFORE onDragOver mutates Redux
      const original = issuesRef.current.find((i) => i.id === draggedId)
      sourceStatusIdRef.current = original?.status.id ?? null
    },
    [activeCardId],
  )

  // ── onDragOver ─────────────────────────────────────────────────────────────
  // Fires continuously while hovering. When card crosses a column boundary,
  // we optimistically dispatch to Redux so the card visually jumps to the new
  // column in real time — this is the key to the smooth cross-column feel.
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const currentIssues = issuesRef.current
      const draggedIssue = currentIssues.find(
        (i) => i.id === active.id.toString(),
      )
      if (!draggedIssue) return

      // Resolve target status: over a card → use that card's status; over a
      // column droppable → over.id IS the statusId passed in data.current
      const overIssue = currentIssues.find((i) => i.id === over.id.toString())
      const targetStatusId: string =
        overIssue?.status.id ??
        (over.data.current?.statusId as string | undefined) ??
        over.id.toString()

      // Only act on column changes — same-column reordering is handled by
      // SortableContext and doesn't need an optimistic Redux dispatch here
      if (draggedIssue.status.id !== targetStatusId) {
        dispatch(
          moveIssueAction({
            id: draggedIssue.id,
            newStatusId: targetStatusId,
            newPosition: draggedIssue.position, // position reconciled on drop
          }),
        )
      }
    },
    [dispatch],
  )

  // ── onDragEnd ──────────────────────────────────────────────────────────────
  // Fires once when the card is released.
  //
  // ⚠️  Cross-column logic MUST come before the `active.id === over.id` guard.
  //
  //     Reason: onDragOver optimistically dispatches moveIssueAction, which
  //     moves the card to the target column in Redux. On drop, dnd-kit's
  //     closestCenter may resolve over.id === active.id because the dragged
  //     card is now the "closest" item to itself in the new column. If we
  //     returned early there, the server mutation would never fire.
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCardId(null)
      const { active, over } = event

      const sourceStatusId = sourceStatusIdRef.current
      sourceStatusIdRef.current = null // clear immediately

      if (!over) return

      const currentIssues = issuesRef.current
      const draggedIssue = currentIssues.find(
        (i) => i.id === active.id.toString(),
      )
      if (!draggedIssue) return

      const overIssue = currentIssues.find((i) => i.id === over.id.toString())
      const targetStatusId: string =
        overIssue?.status.id ??
        (over.data.current?.statusId as string | undefined) ??
        over.id.toString()

      // Build target column sorted list (excluding the dragged card itself)
      const columnIssues = currentIssues
        .filter(
          (i) => i.status.id === targetStatusId && i.id !== draggedIssue.id,
        )
        .sort((a, b) => a.position - b.position)

      const overIndex = columnIssues.findIndex(
        (i) => i.id === over.id.toString(),
      )
      const targetIndex = overIndex === -1 ? columnIssues.length : overIndex

      const newPosition = calculateNewPosition(
        columnIssues[targetIndex - 1]?.position,
        columnIssues[targetIndex]?.position,
      )

      // ── Cross-column drop ────────────────────────────────────────────────
      // Checked FIRST — must not be gated by active.id === over.id because
      // the optimistic Redux update may have made that condition true.
      if (sourceStatusId && sourceStatusId !== targetStatusId) {
        moveIssue({
          issueId: draggedIssue.id,
          sourceStatusId,
          targetStatusId,
          newPosition,
          previousPosition: draggedIssue.position,
        })
        return
      }

      // ── Same-column reorder ──────────────────────────────────────────────
      // Now safe to guard against dropping on same card (genuine no-op).
      if (active.id === over.id) return

      // Guard: cross-priority drop — the selector always sorts by priority first,
      // so this reorder can never stick. Block it before dispatching anything to
      // avoid the snap-back flicker and a wasted/corrupting server mutation.
      const overCard = columnIssues.find((i) => i.id === over.id.toString())
      if (overCard && overCard.priority !== draggedIssue.priority) {
        toast.info(
          'Priority order is locked. Drag cards within the same priority tier to reorder.',
        )
        return
      }

      if (newPosition !== draggedIssue.position) {
        // Optimistic Redux update — mirrors what onDragOver does for cross-column.
        // Without this, removing onSuccess→invalidateQueries left no mechanism
        // to update the UI until the next manual refresh.
        dispatch(reorderIssueAction({ id: draggedIssue.id, newPosition }))
        reorderIssue({
          issueId: draggedIssue.id,
          newPosition,
          previousPosition: draggedIssue.position,
        })
      }
    },
    [moveIssue, reorderIssue],
  )

  return { activeCardId, handleDragStart, handleDragOver, handleDragEnd }
}

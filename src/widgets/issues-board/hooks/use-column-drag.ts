/**
 * useColumnDrag — Column-level drag for the Kanban board.
 *
 * Handles reordering of status columns (left-right drag).
 * Uses useReorderStatus from manage-statuses feature.
 * Optimistic: Redux reorderStatus fires in onDragStart preview,
 * server mutation fires on drop.
 *
 * NOTE: Column drag is separate from card drag — both share the same
 * DndContext but use different SortableContext item lists.
 * We distinguish them by checking active.data.current?.type === 'column'.
 *
 * @layer Widgets
 */
import { useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { DragEndEvent } from '@dnd-kit/core'
import { selectIssueStatuses, reorderStatus } from '@/entities/issue'
import { useReorderStatus } from '@/features/issues/manage-statuses'
import { calculateNewPosition } from '@/features/issues/drag-issue'
import type { AppDispatch } from '@/app/store'

export function useColumnDrag(projectId: string) {
  const dispatch = useDispatch<AppDispatch>()
  const statuses = useSelector(selectIssueStatuses)
  const { mutate: reorderStatusMutation } = useReorderStatus(projectId)

  const statusesRef = useRef(statuses)
  statusesRef.current = statuses

  const handleColumnDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      // Only handle column drags
      if (active.data.current?.type !== 'column') return

      const currentStatuses = statusesRef.current
      const draggedStatus = currentStatuses.find(
        (s) => s.id === active.id.toString(),
      )
      if (!draggedStatus) return

      // Build sorted list excluding the dragged column
      const remaining = currentStatuses
        .filter((s) => s.id !== draggedStatus.id)
        .sort((a, b) => a.position - b.position)

      const overIndex = remaining.findIndex((s) => s.id === over.id.toString())
      const targetIndex = overIndex === -1 ? remaining.length : overIndex

      const newPosition = calculateNewPosition(
        remaining[targetIndex - 1]?.position,
        remaining[targetIndex]?.position,
      )

      if (newPosition === draggedStatus.position) return

      // Optimistic Redux update
      dispatch(reorderStatus({ id: draggedStatus.id, newPosition }))

      // Server mutation
      reorderStatusMutation({ statusId: draggedStatus.id, newPosition })
    },
    [dispatch, reorderStatusMutation],
  )

  return { handleColumnDragEnd }
}

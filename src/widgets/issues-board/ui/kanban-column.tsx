/**
 * KanbanColumn — One Kanban column on the board.
 *
 * Structure:
 *   Header: StatusPill + issue count badge
 *   Body:   SortableContext with IssueCard list (sorted by position)
 *           Empty state drop zone if no issues
 *   Footer: "+ Add issue" button
 *
 * useDroppable registers this column as a drop target so issues can
 * be dragged from other columns into an empty column.
 *
 * @layer Widgets
 */
import { useDroppable } from '@dnd-kit/core'
import { useMemo } from 'react'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus } from 'lucide-react'
import { IssueCard } from './issue-card'
import type { IssueStatus } from '@/entities/issue-status'
import type { Issue } from '@/entities/issue'
import { Badge } from '@/shared/ui/primitives/badge'
import { Button } from '@/shared/ui/primitives/button'
import { ScrollArea, ScrollBar } from '@/shared/ui/primitives/scroll-area'
import { cn } from '@/shared/lib/utils'
import { StatusPill } from '@/entities/issue-status'

interface KanbanColumnProps {
  status: IssueStatus
  issues: Array<Issue>
  projectKey: string
  onCardClick: (issueId: string) => void
  onAddIssue: (statusId: string) => void
}

export function KanbanColumn({
  status,
  issues,
  projectKey,
  onCardClick,
  onAddIssue,
}: KanbanColumnProps) {
  // Register this column as a droppable target (handles empty-column drops)
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: status.id,
    data: { statusId: status.id },
  })

  // Column-level sortable — tagged with type:'column' to distinguish from card drags
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: status.id,
    data: { type: 'column', statusId: status.id },
  })

  // IDs are memoized — SortableContext compares items by reference.
  // A new array on every render causes dnd-kit to re-register all sortables
  // which dispatches to its internal context and cascades into more re-renders.
  // selectFilteredIssues already sorts by priority → position, so no re-sort needed.
  const issueIds = useMemo(() => issues.map((i) => i.id), [issues])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={cn(
        'flex w-80 shrink-0 flex-col rounded-lg border border-subtle bg-layer-1 h-full max-h-full',
        isDragging && 'opacity-50',
      )}
    >
      {/* Header — sticky, drag handle lives here */}
      <div className="flex shrink-0 items-center gap-1 px-2 py-2.5">
        {/* Drag handle — only this triggers column drag */}
        <button
          type="button"
          className="cursor-grab touch-none rounded p-0.5 text-tertiary opacity-0 transition hover:text-secondary group-hover/col:opacity-100 focus:opacity-100 focus:outline-none"
          aria-label="Drag to reorder column"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <StatusPill status={status} />
        <Badge
          variant="default"
          className="ml-auto rounded-full px-2 py-0 text-12"
        >
          {issues.length}
        </Badge>
      </div>

      {/* Body — vertically scrollable */}
      <SortableContext items={issueIds} strategy={verticalListSortingStrategy}>
        <ScrollArea className="flex-1 overflow-hidden">
          <div
            ref={setDropRef}
            className={`flex min-h-20 flex-col gap-2 p-2 transition-colors ${
              isOver ? 'bg-layer-2' : ''
            }`}
          >
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                projectKey={projectKey}
                onClick={() => onCardClick(issue.id)}
              />
            ))}

            {/* Empty column drop zone */}
            {issues.length === 0 && (
              <div
                className={`flex min-h-20 items-center justify-center rounded-md border-2 border-dashed py-8 text-12 text-secondary transition-colors ${
                  isOver ? 'border-accent-subtle text-primary' : 'border-subtle'
                }`}
              >
                {isOver ? 'Drop here' : 'No issues'}
              </div>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SortableContext>

      {/* Footer */}
      <div className="px-2 pb-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-12 text-secondary hover:text-primary"
          onClick={() => onAddIssue(status.id)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add issue
        </Button>
      </div>
    </div>
  )
}

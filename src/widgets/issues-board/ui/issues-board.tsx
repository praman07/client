/**
 * IssuesBoard — Root widget for the Issues Kanban board.
 *
 * Smooth DnD architecture (based on reference kanban.tsx):
 *   - useDragDrop → onDragStart + onDragOver + onDragEnd
 *   - Mouse + Touch + Keyboard sensors
 *   - closestCenter collision detection
 *   - BoardContext shares activeCardId → IssueCard ghost/overlay separation
 *   - tunnel-rat injects the floating overlay card into <DragOverlay> portal
 *   - Accessibility announcements for screen readers
 *
 * Modal inventory (all controlled here — single source of truth):
 *   CreateIssueModal    → KanbanColumn "+ Add issue" footer
 *   EditIssueModal      → IssueCard click
 *   ManageStatusesModal → BoardToolbar "Columns" button
 *   ManageLabelsModal   → BoardToolbar "Labels" button
 *
 * @layer Widgets
 */
import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, shallowEqual } from 'react-redux'
import { ScrollArea, ScrollBar } from '@/shared/ui/primitives/scroll-area'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type Announcements,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'
import { selectIssueStatuses, selectFilteredIssues, selectIssues } from '@/entities/issue'
import { CreateIssueModal } from '@/features/issues/create-issue'
import { EditIssueModal } from '@/features/issues/edit-issue'
import { ManageStatusesModal } from '@/features/issues/manage-statuses'
import { ManageLabelsModal } from '@/features/issues/manage-labels'
import { useBoardData } from '../hooks/use-board-data'
import { useDragDrop } from '../hooks/use-drag-drop'
import { useColumnDrag } from '../hooks/use-column-drag'
import { BoardLoading } from './board-loading'
import { BoardToolbar } from './board-toolbar'
import { KanbanColumn } from './kanban-column'
import { BoardContext } from './board-context'
import { CardTunnel } from './issue-card'

interface IssuesBoardProps {
  projectId: string
  projectKey: string
  projectMembers: Array<{ id: string; fullName: string }>
}

export function IssuesBoard({
  projectId,
  projectKey,
  projectMembers,
}: IssuesBoardProps) {
  // ── Data ──────────────────────────────────────────────────────────────────
  const { isLoading, isFetching, isError, refetch } = useBoardData(projectId)
  const statuses = useSelector(selectIssueStatuses)
  // shallowEqual prevents re-renders when the selector returns a new array
  // with the same contents — .filter().sort() always creates a new reference,
  // so without this every Redux store change would re-render IssuesBoard and
  // cascade into dnd-kit SortableContext re-registrations.
  const filteredIssues = useSelector(selectFilteredIssues, shallowEqual)
  const allIssues = useSelector(selectIssues)

  // ── Drag-drop — cards ──────────────────────────────────────────────────────
  const { activeCardId, handleDragStart, handleDragOver, handleDragEnd: handleCardDragEnd } =
    useDragDrop(projectId)

  // ── Drag-drop — columns ────────────────────────────────────────────────────
  const { handleColumnDragEnd } = useColumnDrag(projectId)

  // Combined onDragEnd: columns first, cards second
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.active.data.current?.type === 'column') {
        handleColumnDragEnd(event)
      } else {
        handleCardDragEnd(event)
      }
    },
    [handleColumnDragEnd, handleCardDragEnd],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 8px movement before activating — prevents onDragStart firing
      // on normal card clicks, which would dispatch setActiveCardId mid-click
      // and cause a re-render cascade during the click event itself.
      activationConstraint: { distance: 8 },
    }),
  )

  // ── Accessibility announcements ───────────────────────────────────────────
  const getTitle = (id: unknown) =>
    allIssues.find((i) => i.id === String(id))?.title ?? String(id)
  const getColumn = (id: unknown) =>
    statuses.find((s) => s.id === String(id))?.name ??
    allIssues.find((i) => i.id === String(id))?.status.name ??
    'a column'

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up issue "${getTitle(active.id)}"`
    },
    onDragOver({ active, over }) {
      return over
        ? `Moving "${getTitle(active.id)}" over "${getColumn(over.id)}"`
        : `Moving "${getTitle(active.id)}"`
    },
    onDragEnd({ active, over }) {
      return over
        ? `Dropped "${getTitle(active.id)}" into "${getColumn(over.id)}"`
        : `Dropped "${getTitle(active.id)}"`
    },
    onDragCancel({ active }) {
      return `Cancelled dragging "${getTitle(active.id)}"`
    },
  }

  // ── Modal state ───────────────────────────────────────────────────────────
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null)
  const [createStatusId, setCreateStatusId] = useState<string | null>(null)
  const [showManageStatuses, setShowManageStatuses] = useState(false)
  const [showManageLabels, setShowManageLabels] = useState(false)

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) return <BoardLoading />

  // ── Error state ───────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertTriangle className="h-8 w-8 text-destructive/60" />
        <p className="text-sm">Failed to load board.</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (statuses.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
        <p className="text-sm">No columns yet.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowManageStatuses(true)}
        >
          Manage Columns
        </Button>
        <ManageStatusesModal
          open={showManageStatuses}
          onOpenChange={setShowManageStatuses}
          projectId={projectId}
        />
      </div>
    )
  }

  return (
    <BoardContext.Provider value={{ activeCardId }}>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Toolbar */}
        <BoardToolbar
          projectMembers={projectMembers}
          isRefreshing={isFetching}
          onRefresh={refetch}
          onManageStatuses={() => setShowManageStatuses(true)}
          onManageLabels={() => setShowManageLabels(true)}
        />

        {/* Kanban board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          accessibility={{ announcements }}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Horizontal scroll — columns row */}
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="flex h-full gap-3 p-4">
              {/* Column SortableContext — enables left-right column reorder drag */}
              <SortableContext
                items={statuses.map((s) => s.id)}
                strategy={horizontalListSortingStrategy}
              >
                {statuses.map((status) => {
                  const columnIssues = filteredIssues.filter(
                    (i) => i.status.id === status.id,
                  )
                  return (
                    <KanbanColumn
                      key={status.id}
                      status={status}
                      issues={columnIssues}
                      projectKey={projectKey}
                      onCardClick={(issueId) => setEditingIssueId(issueId)}
                      onAddIssue={(statusId) => setCreateStatusId(statusId)}
                    />
                  )
                })}
              </SortableContext>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* DragOverlay portal — tunnel-rat injects the active card here */}
          {typeof window !== 'undefined' &&
            createPortal(
              <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
                <CardTunnel.Out />
              </DragOverlay>,
              document.body,
            )}
        </DndContext>

        {/* ── Modals ──────────────────────────────────────────────────────── */}

        {/* Create issue */}
        {createStatusId && (
          <CreateIssueModal
            open={!!createStatusId}
            onOpenChange={(open) => !open && setCreateStatusId(null)}
            projectId={projectId}
            defaultStatusId={createStatusId}
            projectMembers={projectMembers}
          />
        )}

        {/* Edit issue */}
        {editingIssueId && (
          <EditIssueModal
            open={!!editingIssueId}
            onOpenChange={(open) => !open && setEditingIssueId(null)}
            issueId={editingIssueId}
            projectId={projectId}
            projectKey={projectKey}
            projectMembers={projectMembers}
          />
        )}

        {/* Manage statuses */}
        <ManageStatusesModal
          open={showManageStatuses}
          onOpenChange={setShowManageStatuses}
          projectId={projectId}
        />

        {/* Manage labels */}
        <ManageLabelsModal
          open={showManageLabels}
          onOpenChange={setShowManageLabels}
          projectId={projectId}
        />
      </div>
    </BoardContext.Provider>
  )
}

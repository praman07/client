/**
 * IssueCard — Draggable Kanban card, Linear-inspired design.
 *
 * Layout (4 rows):
 *   1. Issue number — faded, reveals on group-hover
 *   2. Title        — line-clamp-2 (CSS adds "…" automatically)
 *   3. Labels row   — max MAX_LABELS shown + "+N" overflow badge (hidden if no labels)
 *   4. Meta row     — PriorityBadge · spacer · DueDateChip? · Avatar?
 *
 * Ghost/Overlay pattern:
 *   Ghost  → dims to opacity-30 while dragging (pointer-events-none)
 *   Overlay → tunneled into DragOverlay in issues-board.tsx
 *
 * @layer Widgets
 */
import { useContext } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import tunnel from 'tunnel-rat'
import { BoardContext } from './board-context'
import type { Issue } from '@/entities/issue'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { DueDateChip, IssueNumber, PriorityBadge } from '@/entities/issue'
import { LabelPill } from '@/entities/issue-label'
import { cn } from '@/shared/lib/utils'

const t = tunnel()
export const CardTunnel = t

/** Max label pills to display before showing "+N" overflow badge */
const MAX_LABELS = 2

interface IssueCardProps {
  issue: Issue
  projectKey: string
  onClick: () => void
}

function CardContent({
  issue,
  projectKey,
}: {
  issue: Issue
  projectKey: string
}) {
  const visibleLabels = issue.labels.slice(0, MAX_LABELS)
  const overflow = issue.labels.length - MAX_LABELS

  return (
    <>
      {/* Row 1: issue number — hidden by default, fades in on card hover */}
      <p className="mb-1 text-10 text-secondary opacity-0 transition-opacity group-hover:opacity-60 select-none">
        <IssueNumber projectKey={projectKey} number={issue.number} />
      </p>

      {/* Row 2: title — 2-line clamp, CSS ellipsis */}
      <p className="line-clamp-2 text-14 font-medium leading-snug text-primary">
        {issue.title}
      </p>

      {/* Row 3: labels — only rendered when there are labels */}
      {issue.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {visibleLabels.map((label) => (
            <LabelPill key={label.id} label={label} />
          ))}
          {overflow > 0 && (
            <span className="text-10 text-secondary">
              +{overflow}
            </span>
          )}
        </div>
      )}

      {/* Row 4: meta — priority (left) · spacer · due date + avatar (right) */}
      <div className="mt-2.5 flex items-center gap-1.5">
        <PriorityBadge priority={issue.priority} />

        <span className="flex-1" />

        {issue.dueDate && (
          <DueDateChip dueDate={issue.dueDate} className="text-[11px]" />
        )}

        {issue.assignee && (
          <Avatar className="h-5 w-5">
            <AvatarImage src={issue.assignee.avatarUrl ?? undefined} />
            <AvatarFallback className="text-[9px]">
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- GQL fullName is nullable */}
              {issue.assignee.fullName?.charAt(0) ?? '?'}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </>
  )
}

export function IssueCard({ issue, projectKey, onClick }: IssueCardProps) {
  const { activeCardId } = useContext(BoardContext)
  const isActive = activeCardId === issue.id

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: issue.id,
    data: { statusId: issue.status.id },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <>
      {/* ── Ghost — stays at origin, dims while dragging ─────────────────── */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        className={cn(
          'group select-none rounded-lg border border-subtle-1 bg-layer-1 p-3 shadow-raised-100',
          'cursor-grab transition-all hover:border-subtle hover:shadow-raised-200',
          isDragging && 'pointer-events-none cursor-grabbing opacity-30',
        )}
      >
        <CardContent issue={issue} projectKey={projectKey} />
      </div>

      {/* ── Overlay — teleported into DragOverlay via tunnel-rat ─────────── */}
      {isActive && (
        <t.In>
          <div
            className={cn(
              'w-72 cursor-grabbing rounded-lg border-2 border-accent-strong bg-layer-1 p-3 shadow-overlay-200',
              'rotate-1 scale-[1.03]',
            )}
          >
            <CardContent issue={issue} projectKey={projectKey} />
          </div>
        </t.In>
      )}
    </>
  )
}

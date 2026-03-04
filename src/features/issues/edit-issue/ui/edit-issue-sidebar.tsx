/**
 * EditIssueSidebar — Right-hand properties panel in the edit-issue modal.
 *
 * Linear-style layout: each property is a flat full-width row with a muted
 * label on the left and an interactive picker on the right. Rows have a
 * subtle hover background and a fixed height so nothing ever wraps.
 *
 * Pickers reused from create-issue toolbar — now all have whitespace-nowrap
 * so their triggers stay single-line regardless of content length.
 *
 * @layer Features
 */
import { useSelector } from 'react-redux'
import { selectIssueLabels, selectIssueStatuses } from '@/entities/issue'
import { StatusPicker } from '@/features/issues/create-issue/ui/toolbar/status-picker'
import { PriorityPicker } from '@/features/issues/create-issue/ui/toolbar/priority-picker'
import { AssigneePicker } from '@/features/issues/create-issue/ui/toolbar/assignee-picker'
import { LabelPicker } from '@/features/issues/create-issue/ui/toolbar/label-picker'
import { MoreMenu } from '@/features/issues/create-issue/ui/toolbar/more-menu'
import { Separator } from '@/shared/ui/primitives/separator'
import type { IssuePriority } from '@/entities/issue'

interface EditIssueSidebarProps {
  projectMembers: Array<{ id: string; fullName: string; avatarUrl?: string }>

  localStatusId: string
  localPriority: IssuePriority
  localAssigneeId: string | null
  localLabelIds: string[]
  localDueDate: string | null

  createdByName: string
  createdAt: string

  onStatusChange: (id: string) => void
  onPriorityChange: (p: IssuePriority) => void
  onAssigneeChange: (id: string | null) => void
  onLabelToggle: (id: string) => void
  onDueDateChange: (date: string | null) => void
}

/**
 * A single property row.
 * - Label: fixed muted text, won't shrink
 * - Value: flex-1 with min-w-0 overflow-hidden so pickers can't overflow
 */
function SidebarRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 min-h-7 rounded-md px-1 hover:bg-muted/30 transition-colors">
      <span className="text-xs text-muted-foreground shrink-0 w-[68px]">{label}</span>
      <div className="min-w-0 flex-1 overflow-hidden flex items-center">
        {children}
      </div>
    </div>
  )
}

export function EditIssueSidebar({
  projectMembers,
  localStatusId,
  localPriority,
  localAssigneeId,
  localLabelIds,
  localDueDate,
  createdByName,
  createdAt,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onLabelToggle,
  onDueDateChange,
}: EditIssueSidebarProps) {
  const statuses = useSelector(selectIssueStatuses)
  const labels = useSelector(selectIssueLabels)

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="w-72 shrink-0 border-l px-3 py-4 overflow-y-auto flex flex-col">
      <p className="text-xs font-medium text-muted-foreground mb-1.5 px-1">Properties</p>

      <div className="flex flex-col gap-0.5">
        <SidebarRow label="Status">
          <StatusPicker
            statuses={statuses}
            value={localStatusId}
            onChange={onStatusChange}
          />
        </SidebarRow>

        <SidebarRow label="Priority">
          <PriorityPicker value={localPriority} onChange={onPriorityChange} />
        </SidebarRow>

        {projectMembers.length > 0 && (
          <SidebarRow label="Assignee">
            <AssigneePicker
              members={projectMembers}
              value={localAssigneeId}
              onChange={onAssigneeChange}
            />
          </SidebarRow>
        )}

        {labels.length > 0 && (
          <SidebarRow label="Labels">
            <LabelPicker
              labels={labels}
              value={localLabelIds}
              onToggle={onLabelToggle}
            />
          </SidebarRow>
        )}

        <SidebarRow label="Due date">
          <MoreMenu dueDate={localDueDate} onDueDateChange={onDueDateChange} />
        </SidebarRow>
      </div>

      <Separator className="my-3" />

      <div className="flex flex-col gap-0.5">
        <SidebarRow label="Author">
          <span className="text-xs truncate">{createdByName}</span>
        </SidebarRow>
        <SidebarRow label="Created">
          <span className="text-xs text-muted-foreground whitespace-nowrap">{formattedDate}</span>
        </SidebarRow>
      </div>
    </div>
  )
}

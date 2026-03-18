/**
 * CreateIssueToolbar — Bottom pill-button row inside the Create Issue modal.
 *
 * Renders status, priority, assignee, labels, and the ··· overflow menu.
 * All state is passed down from the parent form — this is purely presentational.
 *
 * @layer Features
 */
import { StatusPicker } from './status-picker'
import { PriorityPicker } from './priority-picker'
import { AssigneePicker } from './assignee-picker'
import { LabelPicker } from './label-picker'
import { MoreMenu } from './more-menu'
import type { IssueStatus } from '@/entities/issue-status'
import type { IssueLabel } from '@/entities/issue-label'
import type { IssuePriority } from '@/entities/issue'

interface CreateIssueToolbarProps {
  statuses: Array<IssueStatus>
  statusId: string
  onStatusChange: (id: string) => void

  priority: IssuePriority
  onPriorityChange: (p: IssuePriority) => void

  projectMembers: Array<{ id: string; fullName: string; avatarUrl?: string }>
  assigneeId: string | null
  onAssigneeChange: (id: string | null) => void

  labels: Array<IssueLabel>
  labelIds: Array<string>
  onLabelToggle: (id: string) => void

  dueDate: string | null
  onDueDateChange: (date: string | null) => void
}

export function CreateIssueToolbar({
  statuses,
  statusId,
  onStatusChange,
  priority,
  onPriorityChange,
  projectMembers,
  assigneeId,
  onAssigneeChange,
  labels,
  labelIds,
  onLabelToggle,
  dueDate,
  onDueDateChange,
}: CreateIssueToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-4 py-2">
      <StatusPicker
        statuses={statuses}
        value={statusId}
        onChange={onStatusChange}
      />
      <PriorityPicker value={priority} onChange={onPriorityChange} />
      {projectMembers.length > 0 && (
        <AssigneePicker
          members={projectMembers}
          value={assigneeId}
          onChange={onAssigneeChange}
        />
      )}
      {labels.length > 0 && (
        <LabelPicker
          labels={labels}
          value={labelIds}
          onToggle={onLabelToggle}
        />
      )}
      <MoreMenu dueDate={dueDate} onDueDateChange={onDueDateChange} />
    </div>
  )
}

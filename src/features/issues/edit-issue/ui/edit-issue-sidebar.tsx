/**
 * Left sidebar of the edit-issue modal.
 * All fields update parent local state only — no mutations fire until [Save].
 * @layer Features
 */
import React from 'react'
import { useSelector } from 'react-redux'
import { StatusPill } from '@/entities/issue-status'
import { PriorityBadge, DueDateChip, selectIssueLabels } from '@/entities/issue'
import { LabelPill } from '@/entities/issue-label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select'
import { cn } from '@/shared/lib/utils'
import type { IssuePriority, Issue } from '@/entities/issue'

interface EditIssueSidebarProps {
  issue: Issue
  projectMembers: Array<{ id: string; fullName: string }>
  localAssigneeId: string | null
  localLabelIds: string[]
  localPriority: IssuePriority
  localDueDate: string | null
  onAssigneeChange: (id: string | null) => void
  onLabelToggle: (id: string) => void
  onPriorityChange: (p: IssuePriority) => void
  onDueDateChange: (date: string | null) => void
}

const PRIORITIES: IssuePriority[] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW', 'NO_PRIORITY']
const PRIORITY_LABELS: Record<IssuePriority, string> = {
  URGENT: 'Urgent', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low', NO_PRIORITY: 'No Priority',
}

function SidebarRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-center gap-2 py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export function EditIssueSidebar({
  issue,
  projectMembers,
  localAssigneeId,
  localLabelIds,
  localPriority,
  localDueDate,
  onAssigneeChange,
  onLabelToggle,
  onPriorityChange,
  onDueDateChange,
}: EditIssueSidebarProps) {
  const allLabels = useSelector(selectIssueLabels)

  return (
    <div className="w-56 shrink-0 border-r px-4 py-3 space-y-0.5 overflow-y-auto">
      {/* Status — display only, changed via drag on the board */}
      <SidebarRow label="Status">
        <StatusPill status={issue.status} className="text-xs" />
      </SidebarRow>

      {/* Priority */}
      <SidebarRow label="Priority">
        <Select
          value={localPriority}
          onValueChange={(v) => onPriorityChange(v as IssuePriority)}
        >
          <SelectTrigger className="h-6 border-none bg-transparent p-0 text-xs shadow-none hover:bg-accent">
            <SelectValue>
              <PriorityBadge priority={localPriority} showLabel size={12} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                <span className="flex items-center gap-1.5">
                  <PriorityBadge priority={p} size={12} />
                  {PRIORITY_LABELS[p]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarRow>

      {/* Assignee */}
      <SidebarRow label="Assignee">
        <Select
          value={localAssigneeId ?? 'unassigned'}
          onValueChange={(v) => onAssigneeChange(v === 'unassigned' ? null : v)}
        >
          <SelectTrigger className="h-6 border-none bg-transparent p-0 text-xs shadow-none hover:bg-accent">
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {projectMembers.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarRow>

      {/* Labels */}
      <SidebarRow label="Labels">
        <div className="flex flex-wrap gap-1">
          {allLabels.length === 0 && (
            <span className="text-xs text-muted-foreground">None</span>
          )}
          {allLabels.map((label) => {
            const active = localLabelIds.includes(label.id)
            return (
              <button
                key={label.id}
                type="button"
                onClick={() => onLabelToggle(label.id)}
                className="focus:outline-none"
              >
                <LabelPill
                  label={label}
                  className={cn(active ? '' : 'opacity-40')}
                />
              </button>
            )
          })}
        </div>
      </SidebarRow>

      {/* Due date */}
      <SidebarRow label="Due date">
        <input
          type="date"
          value={localDueDate ?? ''}
          onChange={(e) => onDueDateChange(e.target.value || null)}
          className="h-6 rounded border-none bg-transparent text-xs hover:bg-accent focus:outline-none cursor-pointer"
        />
        {localDueDate && <DueDateChip dueDate={localDueDate} className="ml-1" />}
      </SidebarRow>

      <div className="pt-4 border-t mt-4 space-y-1">
        <SidebarRow label="Created by">
          <span className="text-xs">{issue.createdBy.fullName}</span>
        </SidebarRow>
      </div>
    </div>
  )
}

/**
 * TanStack Form for creating a new issue.
 *
 * Fields:
 *   1. title      — Input (required, autoFocus)
 *   2. statusId   — Select with StatusPill options
 *   3. priority   — Select with PriorityBadge options
 *   4. assigneeId — Combobox of project members (optional)
 *   5. labelIds   — Multi-select checkbox list of project labels (optional)
 *   6. dueDate    — text input (ISO date string, optional)
 *
 * Description is NOT included in the create flow.
 * It is added via the edit modal after the issue is created.
 *
 * @layer Features
 */
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select'
import { StatusPill } from '@/entities/issue-status'
import { LabelPill } from '@/entities/issue-label'
import {
  PriorityBadge,
  selectIssueStatuses,
  selectIssueLabels,
} from '@/entities/issue'
import type { IssuePriority } from '@/entities/issue'
import { useCreateIssue } from '../hooks/use-create-issue'
import { createIssueSchema } from '../model/schema'
import { mapCreateIssueError } from '../lib/error-mapping'

const PRIORITIES: IssuePriority[] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW', 'NO_PRIORITY']
const PRIORITY_LABELS: Record<IssuePriority, string> = {
  URGENT: 'Urgent', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low', NO_PRIORITY: 'No Priority',
}

interface CreateIssueFormProps {
  projectId: string
  /** Pre-selects the status (column where + was clicked) */
  defaultStatusId: string
  projectMembers: Array<{ id: string; fullName: string }>
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateIssueForm({
  projectId,
  defaultStatusId,
  projectMembers,
  onSuccess,
  onCancel,
}: CreateIssueFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: createIssue, isPending } = useCreateIssue()
  const statuses = useSelector(selectIssueStatuses)
  const labels = useSelector(selectIssueLabels)

  const form = useForm({
    defaultValues: {
      title:      '',
      statusId:   defaultStatusId,
      priority:   'NO_PRIORITY' as IssuePriority,
      assigneeId: null as string | null,
      labelIds:   [] as string[],
      dueDate:    null as string | null,
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        await createIssue({
          projectId,
          title:      value.title.trim(),
          statusId:   value.statusId,
          priority:   value.priority,
          assigneeId: value.assigneeId,
          labelIds:   value.labelIds,
          dueDate:    value.dueDate,
        })
        toast.success('Issue created')
        onSuccess?.()
      } catch (error: unknown) {
        const message = mapCreateIssueError(error)
        setRootError(message)
        toast.error(message)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {rootError && (
        <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
          {rootError}
        </div>
      )}

      {/* Title */}
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => {
            const result = createIssueSchema.shape.title.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Issue title <span className="text-destructive">*</span></Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="What needs to be done?"
              disabled={isPending}
              autoFocus
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-3">
        {/* Status */}
        <form.Field name="statusId">
          {(field) => (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={field.state.value}
                onValueChange={(v) => { if (v) field.handleChange(v) }}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <StatusPill status={s} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        {/* Priority */}
        <form.Field name="priority">
          {(field) => (
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={field.state.value}
                onValueChange={(v) => field.handleChange(v as IssuePriority)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
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
            </div>
          )}
        </form.Field>
      </div>

      {/* Assignee */}
      {projectMembers.length > 0 && (
        <form.Field name="assigneeId">
          {(field) => (
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={field.state.value ?? 'unassigned'}
                onValueChange={(v) => field.handleChange(() => v === 'unassigned' ? null : v)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {projectMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
      )}

      {/* Labels */}
      {labels.length > 0 && (
        <form.Field name="labelIds">
          {(field) => (
            <div className="space-y-2">
              <Label>Labels</Label>
              <div className="flex flex-wrap gap-1.5">
                {labels.map((label) => {
                  const active = field.state.value.includes(label.id)
                  return (
                    <button
                      key={label.id}
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        field.handleChange(
                          active
                            ? field.state.value.filter((id) => id !== label.id)
                            : [...field.state.value, label.id],
                        )
                      }
                    >
                      <LabelPill label={label} className={active ? 'ring-2 ring-offset-1' : 'opacity-50'} />
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </form.Field>
      )}

      {/* Due date */}
      <form.Field name="dueDate">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Due date</Label>
            <Input
              id={field.name}
              type="date"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(() => e.target.value || null)}
              disabled={isPending}
            />
          </div>
        )}
      </form.Field>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit || isPending}>
              {isPending ? 'Creating…' : 'Create issue'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}

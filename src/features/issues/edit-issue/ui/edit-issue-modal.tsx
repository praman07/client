/**
 * Edit Issue Modal — two-panel Dialog (max-w-4xl).
 *
 * Manages local state for all editable fields.
 * Changes are buffered locally; nothing is sent to the server until [Save] is clicked.
 *
 * On Save:
 *   - useUpdateIssue fires if any metadata changed
 *   - useDescriptionUpload fires if blocks changed (skipped if no change)
 *
 * URL deep-linking: parent page should set ?issue=<issueId> when opening.
 *
 * @layer Features
 */
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
} from '@/shared/ui/primitives/dialog'
import { useGetIssue } from '../hooks/use-get-issue'
import { useUpdateIssue } from '../hooks/use-update-issue'
import { useDeleteIssue } from '../hooks/use-delete-issue'
import { useDescriptionUpload } from '../hooks/use-description-upload'
import { EditIssueHeader } from './edit-issue-header'
import { EditIssueSidebar } from './edit-issue-sidebar'
import { EditIssueContent } from './edit-issue-content'
import { mapUpdateIssueError } from '../lib/error-mapping'
import type { IssuePriority } from '@/entities/issue'

interface EditIssueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = modal is closed / nothing loaded */
  issueId: string | null
  projectId: string
  projectKey: string
  projectMembers: Array<{ id: string; fullName: string; avatarUrl?: string }>
}

export function EditIssueModal({
  open,
  onOpenChange,
  issueId,
  projectId,
  projectKey,
  projectMembers,
}: EditIssueModalProps) {
  const { data: issue, isLoading } = useGetIssue(issueId)
  const { mutateAsync: updateIssue, isPending: isSavingMeta } = useUpdateIssue(projectId)
  const { mutateAsync: deleteIssue } = useDeleteIssue(projectId)
  const { upload, state: descState } = useDescriptionUpload()

  // ── Local state (buffered until Save) ──────────────────────────────────────
  const [localTitle, setLocalTitle] = useState('')
  const [localPriority, setLocalPriority] = useState<IssuePriority>('NO_PRIORITY')
  const [localAssigneeId, setLocalAssigneeId] = useState<string | null>(null)
  const [localLabelIds, setLocalLabelIds] = useState<string[]>([])
  const [localDueDate, setLocalDueDate] = useState<string | null>(null)
  const [currentBlocks, setCurrentBlocks] = useState<unknown[]>([])
  const [originalBlocks, setOriginalBlocks] = useState<unknown[]>([])

  // ── Seed local state when issue loads ──────────────────────────────────────
  useEffect(() => {
    if (!issue) return
    setLocalTitle(issue.title)
    setLocalPriority(issue.priority as IssuePriority)
    setLocalAssigneeId(issue.assignee?.id ?? null)
    setLocalLabelIds(issue.labels.map((l: { id: string }) => l.id))
    setLocalDueDate(issue.dueDate ?? null)
  }, [issue])

  const isDirty = !!issue && (
    localTitle !== issue.title ||
    localPriority !== issue.priority ||
    localAssigneeId !== (issue.assignee?.id ?? null) ||
    JSON.stringify(localLabelIds.sort()) !== JSON.stringify(issue.labels.map((l: { id: string }) => l.id).sort()) ||
    localDueDate !== (issue.dueDate ?? null)
  )
  const isSaving = isSavingMeta || descState.status === 'uploading' || descState.status === 'requesting' || descState.status === 'confirming'

  const handleSave = async () => {
    if (!issue || !issueId) return
    try {
      const metaChanged = isDirty
      if (metaChanged) {
        await updateIssue({
          issueId,
          title:      localTitle !== issue.title ? localTitle : undefined,
          priority:   localPriority !== issue.priority ? localPriority : undefined,
          assigneeId: localAssigneeId !== (issue.assignee?.id ?? null) ? localAssigneeId : undefined,
          labelIds:   JSON.stringify(localLabelIds.sort()) !== JSON.stringify(issue.labels.map((l: { id: string }) => l.id).sort()) ? localLabelIds : undefined,
          dueDate:    localDueDate !== (issue.dueDate ?? null) ? localDueDate : undefined,
        })
      }
      await upload(issueId, currentBlocks, originalBlocks)
      toast.success('Issue saved')
      onOpenChange(false)
    } catch (error) {
      toast.error(mapUpdateIssueError(error))
    }
  }

  const handleDelete = async () => {
    if (!issueId) return
    await deleteIssue(issueId)
    toast.success('Issue deleted')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-4xl flex-col p-0 h-[80vh] overflow-hidden">
        {isLoading || !issue ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : (
          <>
            <EditIssueHeader
              projectKey={projectKey}
              issueNumber={issue.number}
              isDirty={isDirty}
              isSaving={isSaving}
              onSave={handleSave}
              onDelete={handleDelete}
              onClose={() => onOpenChange(false)}
            />
            <div className="flex flex-1 overflow-hidden">
              <EditIssueSidebar
                issue={issue as any}
                projectMembers={projectMembers}
                localAssigneeId={localAssigneeId}
                localLabelIds={localLabelIds}
                localPriority={localPriority}
                localDueDate={localDueDate}
                onAssigneeChange={setLocalAssigneeId}
                onLabelToggle={(id: string) =>
                  setLocalLabelIds((prev) =>
                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                  )
                }
                onPriorityChange={setLocalPriority}
                onDueDateChange={setLocalDueDate}
              />
              <EditIssueContent
                title={localTitle}
                onTitleChange={setLocalTitle}
                descriptionS3Key={issue.descriptionS3Key ?? null}
                issueId={issueId!}
                onBlocksChange={(blocks: unknown[]) => {
                  setCurrentBlocks(blocks)
                  if (originalBlocks.length === 0 && blocks.length > 0) {
                    setOriginalBlocks(blocks)
                  }
                }}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

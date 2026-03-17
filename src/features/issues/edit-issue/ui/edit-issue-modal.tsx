/**
 * Edit Issue Modal — Linear-style two-panel Dialog (max-w-6xl).
 *
 * Layout:
 *   ┌──────────────────────────────────────────────────────┐
 *   │  Header: Issue# | [Save] [⋯] [×]                     │
 *   ├──────────────────────────────┬───────────────────────┤
 *   │  Content (flex-1)            │  Sidebar (w-64)       │
 *   │  - Input title (2xl bold)    │  - Status picker      │
 *   │  - BlockNote description     │  - Priority picker    │
 *   │    (loads from S3)           │  - Assignee picker    │
 *   │                              │  - Labels picker      │
 *   │                              │  - Due date picker    │
 *   │                              │  ────────────────     │
 *   │                              │  - Created by / at    │
 *   └──────────────────────────────┴───────────────────────┘
 *
 * State strategy:
 *   - All fields are buffered locally; nothing is sent until Save.
 *   - isDirty = any metadata field changed OR description blocks changed.
 *   - originalBlocks are seeded once via onDescriptionLoaded callback
 *     (fired by EditIssueDescriptionEditor after fetching from S3,
 *      or immediately with [] if no descriptionS3Key).
 *   - On Save the modal stays open, originalBlocks are reset to currentBlocks.
 *
 * @layer Features
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useGetIssue } from '../hooks/use-get-issue'
import { useUpdateIssue } from '../hooks/use-update-issue'
import { useDeleteIssue } from '../hooks/use-delete-issue'
import { useDescriptionUpload } from '../hooks/use-description-upload'
import { mapUpdateIssueError } from '../lib/error-mapping'
import { EditIssueHeader } from './edit-issue-header'
import { EditIssueSidebar } from './edit-issue-sidebar'
import { EditIssueContent } from './edit-issue-content'
import type { IssuePriority } from '@/entities/issue'
import { Dialog, DialogContent } from '@/shared/ui/primitives/dialog'

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
  const { mutateAsync: updateIssue, isPending: isSavingMeta } =
    useUpdateIssue(projectId)
  const { mutateAsync: deleteIssue } = useDeleteIssue(projectId)
  const { upload, state: descState } = useDescriptionUpload()

  // ── Local state (buffered until Save) ────────────────────────────────────────
  const [localTitle, setLocalTitle] = useState('')
  const [localStatusId, setLocalStatusId] = useState('')
  const [localPriority, setLocalPriority] =
    useState<IssuePriority>('NO_PRIORITY')
  const [localAssigneeId, setLocalAssigneeId] = useState<string | null>(null)
  const [localLabelIds, setLocalLabelIds] = useState<Array<string>>([])
  const [localDueDate, setLocalDueDate] = useState<string | null>(null)

  // Description blocks: current (editor) vs original (last saved / loaded from S3)
   
  const [currentBlocks, setCurrentBlocks] = useState<Array<any>>([])
   
  const [originalBlocks, setOriginalBlocks] = useState<Array<any>>([])
  // Guard so originalBlocks are seeded exactly once per modal open session
  const descSeeded = useRef(false)

  // ── Seed local state when issue loads ────────────────────────────────────────
  useEffect(() => {
    if (!issue) return
    setLocalTitle(issue.title)
    setLocalStatusId(issue.status?.id ?? '')
    setLocalPriority(issue.priority as IssuePriority)
    setLocalAssigneeId(issue.assignee?.id ?? null)
    setLocalLabelIds(issue.labels.map((l: { id: string }) => l.id))
    setLocalDueDate(issue.dueDate ?? null)
  }, [issue])

  // Reset description seed guard when issueId changes (new issue opened)
  useEffect(() => {
    descSeeded.current = false
    setCurrentBlocks([])
    setOriginalBlocks([])
  }, [issueId])

  // ── onDescriptionLoaded — seeded once after S3 fetch, or immediately if empty
  const handleDescriptionLoaded = useCallback(
     
    (blocks: Array<any>) => {
      if (descSeeded.current) return
      descSeeded.current = true
      setOriginalBlocks(blocks)
      setCurrentBlocks(blocks)
    },
    [],
  )

  // ── Dirty checks ─────────────────────────────────────────────────────────────
  const isMetaDirty =
    !!issue &&
    (localTitle !== issue.title ||
      localStatusId !== (issue.status?.id ?? '') ||
      localPriority !== issue.priority ||
      localAssigneeId !== (issue.assignee?.id ?? null) ||
      JSON.stringify([...localLabelIds].sort()) !==
        JSON.stringify(issue.labels.map((l: { id: string }) => l.id).sort()) ||
      localDueDate !== (issue.dueDate ?? null))
  const isDescriptionDirty =
    JSON.stringify(currentBlocks) !== JSON.stringify(originalBlocks)
  const isDirty = isMetaDirty || isDescriptionDirty

  const isSaving =
    isSavingMeta ||
    descState.status === 'requesting' ||
    descState.status === 'uploading' ||
    descState.status === 'confirming'

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!issue || !issueId) return
    try {
      if (isMetaDirty) {
        await updateIssue({
          issueId,
          title: localTitle !== issue.title ? localTitle : undefined,
          statusId:
            localStatusId !== (issue.status?.id ?? '')
              ? localStatusId
              : undefined,
          priority:
            localPriority !== issue.priority ? localPriority : undefined,
          assigneeId:
            localAssigneeId !== (issue.assignee?.id ?? null)
              ? localAssigneeId
              : undefined,
          labelIds:
            JSON.stringify([...localLabelIds].sort()) !==
            JSON.stringify(issue.labels.map((l: { id: string }) => l.id).sort())
              ? localLabelIds
              : undefined,
          dueDate:
            localDueDate !== (issue.dueDate ?? null) ? localDueDate : undefined,
        })
      }

      await upload(issueId, currentBlocks, originalBlocks)

      // Reset the description baseline so the save button disables again
      setOriginalBlocks(currentBlocks)

      toast.success('Issue saved')
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
      <DialogContent
        className="flex max-w-6xl sm:max-w-6xl lg:max-w-6xl flex-col p-0 h-[85vh] overflow-hidden gap-0"
        showCloseButton={false}
      >
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

            {/* Two-panel body */}
            <div className="flex flex-1 overflow-hidden">
              {/* ── Left: Title + BlockNote description ── */}
              <EditIssueContent
                title={localTitle}
                onTitleChange={setLocalTitle}
                issueId={issueId!}
                descriptionS3Key={issue.descriptionS3Key ?? null}
                editable={!isSaving}
                onBlocksChange={setCurrentBlocks}
                onDescriptionLoaded={handleDescriptionLoaded}
              />

              {/* ── Right: Properties sidebar ── */}
              <EditIssueSidebar
                projectMembers={projectMembers}
                localStatusId={localStatusId}
                localPriority={localPriority}
                localAssigneeId={localAssigneeId}
                localLabelIds={localLabelIds}
                localDueDate={localDueDate}
                createdByName={issue.createdBy?.fullName ?? 'Unknown'}
                createdAt={issue.createdAt}
                onStatusChange={setLocalStatusId}
                onPriorityChange={setLocalPriority}
                onAssigneeChange={setLocalAssigneeId}
                onLabelToggle={(id: string) =>
                  setLocalLabelIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((x) => x !== id)
                      : [...prev, id],
                  )
                }
                onDueDateChange={setLocalDueDate}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

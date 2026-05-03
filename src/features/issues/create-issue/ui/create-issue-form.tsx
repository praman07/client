/**
 * CreateIssueForm — Linear-style issue creation interface.
 *
 * Layout:
 *   ┌──────────────────────────────────────────┐
 *   │ [icon] ProjectKey › New issue   [⤢] [✕]  │  ← breadcrumb header
 *   ├──────────────────────────────────────────┤
 *   │  Issue title                             │  ← auto-resize Textarea
 *   │  Add description…                        │  ← BlockNote placeholder
 *   ├──────────────────────────────────────────┤
 *   │ [● Status] [··· Priority] [👤 Assignee] │  ← toolbar pills
 *   │ [🏷 Labels] [···]                        │
 *   ├──────────────────────────────────────────┤
 *   │ [📎]            [Create more ○] [Create] │  ← footer
 *   └──────────────────────────────────────────┘
 *
 * Description is intentionally a placeholder.
 * It is added via the edit modal after the issue is created.
 *
 * @layer Features
 */
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import {
  FileText,
  X,
  Paperclip,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { useCreateIssue } from '../hooks/use-create-issue'
import {
  isDescriptionEmpty,
  useCreateIssueDescription,
} from '../hooks/use-create-issue-description'
import { createIssueSchema } from '../model/schema'
import { mapCreateIssueError } from '../lib/error-mapping'
import { CreateIssueToolbar } from './toolbar/create-issue-toolbar'
import { IssueDescriptionEditor } from './issue-description-editor'
import type { IssuePriority } from '@/entities/issue'
import type { BlockNoteEditor } from '@blocknote/core'
import { selectIssueLabels, selectIssueStatuses } from '@/entities/issue'
import { Separator } from '@/shared/ui/primitives/separator'
import { Switch } from '@/shared/ui/primitives/switch'
import { Input } from '@/shared/ui/primitives/input'
import { Button } from '@/shared/ui/primitives/button'

interface CreateIssueFormProps {
  projectId: string
  projectKey: string
  defaultStatusId: string
  projectMembers: Array<{ id: string; fullName: string; avatarUrl?: string }>
  isExpanded?: boolean
  onToggleExpand?: () => void
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateIssueForm({
  projectId,
  projectKey,
  defaultStatusId,
  projectMembers,
  isExpanded = false,
  onToggleExpand,
  onSuccess,
  onCancel,
}: CreateIssueFormProps) {
  // ── Field state ──────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [statusId, setStatusId] = useState(defaultStatusId)
  const [priority, setPriority] = useState<IssuePriority>('NO_PRIORITY')
  const [assigneeId, setAssigneeId] = useState<string | null>(null)
  const [labelIds, setLabelIds] = useState<Array<string>>([])
  const [dueDate, setDueDate] = useState<string | null>(null)
  const [createMore, setCreateMore] = useState(false)

  const statuses = useSelector(selectIssueStatuses)
  const labels = useSelector(selectIssueLabels)
  const { mutateAsync: createIssue, isPending } = useCreateIssue()
  const { upload: uploadDescription, state: descUploadState } =
    useCreateIssueDescription()

  // ── BlockNote editor ref ─────────────────────────────────────────────────────
  // Read editor.document synchronously on submit — avoids stale-closure issues
  // that come from reading React state captured at callback creation time.
   
  const editorRef = useRef<BlockNoteEditor<any> | null>(null)
   
  const [descriptionBlocks, setDescriptionBlocks] = useState<Array<any>>([])

  // ── Title ref (for focus on createMore reset) ─────────────────────────────
  const titleRef = useRef<HTMLInputElement>(null)

  // ── Derived ──────────────────────────────────────────────────────────────────
  const titleValid = createIssueSchema.shape.title.safeParse(
    title.trim(),
  ).success
  const isUploading = !['idle', 'done', 'error'].includes(
    descUploadState.status,
  )
  const canSubmit = titleValid && !isPending && !isUploading

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    try {
      // ── Step 1: Create the issue row ─────────────────────────────────────────
      const result = await createIssue({
        projectId,
        title: title.trim(),
        statusId,
        priority,
        assigneeId,
        labelIds,
        dueDate,
      })

      // ── Step 2: Upload description (skipped if editor is empty) ───────────────
      const issueId = result.createIssue.issue.id
      const blocks = editorRef.current?.document ?? descriptionBlocks
      if (issueId && !isDescriptionEmpty(blocks)) {
        // originalBlocks = [] because this is a brand-new issue (nothing saved yet)
        await uploadDescription(issueId, blocks, [])
      }

      toast.success('Issue created')
      if (createMore) {
        // Reset form fields, keep modal open
        setTitle('')
        setPriority('NO_PRIORITY')
        setAssigneeId(null)
        setLabelIds([])
        setDueDate(null)
        setStatusId(defaultStatusId)
        setDescriptionBlocks([])
        titleRef.current?.focus()
      } else {
        onSuccess?.()
      }
    } catch (error: unknown) {
      toast.error(mapCreateIssueError(error))
    }
  }

  // ── Label toggle ─────────────────────────────────────────────────────────────
  const handleLabelToggle = (id: string) =>
    setLabelIds((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* ── Header breadcrumb ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-subtle">
        <FileText
          className="size-4 text-secondary shrink-0"
        />
        <span className="text-11 text-secondary font-medium">
          {projectKey}
        </span>
        <span className="text-11 text-secondary">›</span>
        <span className="text-11 text-primary font-medium">New issue</span>

        {/* Spacer */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onToggleExpand}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onCancel}
            title="Close"
          >
            <X
              className="size-4"
            />
          </Button>
        </div>
      </div>

      {/* ── Content area ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-y-auto gap-0 px-4 pt-3 pb-0">
        {/* Title */}
        <Input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue title"
          disabled={isPending}
          autoFocus
          className="border-none bg-transparent px-0 h-auto py-0 text-40 md:text-24 font-medium shadow-none focus-visible:ring-0 leading-snug placeholder:text-placeholder"
        />

        {/* Description — BlockNote editor */}
        <div>
          <IssueDescriptionEditor
            projectId={projectId}
            editorRef={editorRef}
            onChange={setDescriptionBlocks}
            editable={!isPending && !isUploading}
          />
        </div>
      </div>

      <Separator />

      {/* ── Toolbar pills ──────────────────────────────────────────────────────── */}
      <CreateIssueToolbar
        statuses={statuses}
        statusId={statusId}
        onStatusChange={setStatusId}
        priority={priority}
        onPriorityChange={setPriority}
        projectMembers={projectMembers}
        assigneeId={assigneeId}
        onAssigneeChange={setAssigneeId}
        labels={labels}
        labelIds={labelIds}
        onLabelToggle={handleLabelToggle}
        dueDate={dueDate}
        onDueDateChange={setDueDate}
      />

      <Separator />

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center px-4 py-2.5">
        {/* Attachment icon — future */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-tertiary"
          title="Attach file"
          disabled
        >
          <Paperclip
            className="size-4"
          />
        </Button>

        {/* Spacer */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="create-more"
              checked={createMore}
              onCheckedChange={setCreateMore}
              className="scale-75"
            />
            <label
              htmlFor="create-more"
              className="text-11 text-secondary select-none cursor-pointer"
            >
              Create more
            </label>
          </div>

          <Button type="submit" size="sm" disabled={!canSubmit}>
            {isPending
              ? 'Creating…'
              : isUploading
                ? 'Uploading…'
                : 'Create issue'}
          </Button>
        </div>
      </div>
    </form>
  )
}

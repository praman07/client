/**
 * CreateIssueModal — Linear-style Dialog shell.
 *
 * Manages isExpanded state — when expanded the dialog grows to max-w-4xl
 * and gains a minimum height. The toggle is passed down to CreateIssueForm
 * which renders the expand/collapse button in the header.
 *
 * @layer Features
 */
import { useState } from 'react'
import { CreateIssueForm } from './create-issue-form'
import { Dialog, DialogContent } from '@/shared/ui/primitives/dialog'

interface CreateIssueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  projectKey: string
  /** The column ID where + was clicked — pre-selects the status field */
  defaultStatusId: string
  projectMembers: Array<{ id: string; fullName: string; avatarUrl?: string }>
}

export function CreateIssueModal({
  open,
  onOpenChange,
  projectId,
  projectKey,
  defaultStatusId,
  projectMembers,
}: CreateIssueModalProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          isExpanded
            ? 'max-w-4xl sm:max-w-4xl lg:max-w-4xl h-[80vh] p-0 gap-0 overflow-hidden top-[50%]'
            : 'max-w-3xl sm:max-w-3xl lg:max-w-3xl h-[480px] p-0 gap-0 overflow-hidden top-[30%]'
        }
        showCloseButton={false}
      >
        <CreateIssueForm
          projectId={projectId}
          projectKey={projectKey}
          defaultStatusId={defaultStatusId}
          projectMembers={projectMembers}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded((v) => !v)}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

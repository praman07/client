import { useParams } from '@tanstack/react-router'
import { AddPageCollaboratorsForm } from './add-page-collaborators-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import { usePageCollaborators } from '@/features/pages/fetch-page-collaborators'
import { useWorkspaceMembers } from '@/features/view-members/hooks'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'

interface AddPageCollaboratorsDialogProps {
  pageId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Dialog for adding collaborators to a page.
 *
 * Fetches workspace members and current page collaborators internally.
 * Filters out already-collaborating members before passing to the form.
 * Shows an empty state when all workspace members are already collaborators.
 *
 * Mirrors whiteboard `add-collaborators/ui/add-collaborators-dialog.tsx` 1:1.
 *
 * @layer Features
 * @module pages/add-page-collaborators
 */
export function AddPageCollaboratorsDialog({
  pageId,
  open,
  onOpenChange,
}: AddPageCollaboratorsDialogProps) {
  const { workspaceSlug } = useParams({ strict: false })
  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )

  const { data: membersData } = useWorkspaceMembers(workspace?.id ?? '')
  const { data: collaborators } = usePageCollaborators(pageId)

  const workspaceMembers = membersData?.workspaceMembers ?? []
  const currentCollaboratorIds = (collaborators ?? []).map((c) => c.userId)

  // Filter out members already on this page
  const availableMembers = workspaceMembers.filter(
    (m) => !currentCollaboratorIds.includes(m.user.id),
  )

  if (availableMembers.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Collaborators</DialogTitle>
            <DialogDescription>
              All workspace members are already collaborators on this page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Collaborators</DialogTitle>
          <DialogDescription>
            Select workspace members to add to this page
          </DialogDescription>
        </DialogHeader>
        <AddPageCollaboratorsForm
          pageId={pageId}
          availableMembers={availableMembers}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

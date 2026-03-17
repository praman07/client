import { useNavigate, useParams } from '@tanstack/react-router'
import { useCreatePageModal } from '../hooks/use-create-page-modal'
import { CreatePageForm } from './create-page-form'
import type { Page } from '@/entities/page'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'

/**
 * Modal wrapper for CreatePageForm.
 * Reads isOpen + parentId from Redux (via useCreatePageModal).
 * On success navigates to the new page.
 *
 * Position is always 1 (appended at the end for simplicity — server reorders if
 * needed, and useProjectPages refetches on invalidation).
 *
 * Render inside <PageSidebar> so it overlays correctly.
 *
 * @layer Features
 */
export function CreatePageModal() {
  const { isOpen, parentId, close } = useCreatePageModal()
  const { workspaceSlug, projectSlug } = useParams({ strict: false })
  const navigate = useNavigate()

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const project = useAppSelector(selectCurrentProject)

  if (!workspace?.id || !project?.id) return null

  const handleSuccess = (page: Page) => {
    close()
    navigate({
      to: '/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId',
      params: { workspaceSlug, projectSlug, pageId: page.id },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Page</DialogTitle>
          <DialogDescription>
            {parentId ? 'Create a new child page.' : 'Create a new root page.'}
          </DialogDescription>
        </DialogHeader>
        <CreatePageForm
          workspaceId={workspace.id}
          projectId={project.id}
          parentId={parentId}
          position={65536}
          onSuccess={handleSuccess}
          onCancel={close}
        />
      </DialogContent>
    </Dialog>
  )
}

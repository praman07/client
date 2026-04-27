import { useState } from 'react'
import {
  Archive,
  FilePlus,
  MoreHorizontal,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { useArchivePage } from '@/features/pages/toggle-page-archive'
import { useDeletePage } from '@/features/pages/delete-page'
import { useCreatePageModal } from '@/features/pages/create-page'
import { AddPageCollaboratorsDialog } from '@/features/pages/add-page-collaborators'
import { ManageCollaboratorsDialog } from '@/features/pages/manage-page-collaborators'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'
import { Guard } from '@/shared/lib/auth'

interface PageTreeItemActionsProps {
  pageId: string
  pageTitle: string
}

/**
 * Hover actions for a page tree item.
 * Uses a plain button trigger (SidebarMenuAction styling applied via className)
 * since SidebarMenuAction uses useRender API and cannot be wrapped with asChild.
 *
 * @layer Widgets
 */
export function PageTreeItemActions({
  pageId,
  pageTitle,
}: PageTreeItemActionsProps) {
  const { open } = useCreatePageModal()
  const { mutate: archivePage } = useArchivePage()
  const { mutate: deletePage } = useDeletePage()
  const { workspaceSlug } = useParams({ strict: false })
  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const project = useAppSelector(selectCurrentProject)
  const [open2, setOpen2] = useState(false)
  const [addCollabOpen, setAddCollabOpen] = useState(false)
  const [manageCollabOpen, setManageCollabOpen] = useState(false)

  return (
    <>
      <DropdownMenu open={open2} onOpenChange={setOpen2}>
        <DropdownMenuTrigger
          render={
            <button
              className="text-secondary hover:text-primary hover:bg-layer-transparent-hover absolute top-1.5 right-1 aspect-square w-5 rounded-md p-0 flex items-center justify-center invisible group-hover/menu-item:visible focus:visible transition-opacity"
              aria-label={`More actions for ${pageTitle}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        />
        <DropdownMenuContent side="right" align="start" className="w-52">
          <Guard permission="page:create">
            <DropdownMenuItem onClick={() => open({ parentId: pageId })}>
              <FilePlus className="mr-2 h-4 w-4" />
              Add child page
            </DropdownMenuItem>
          </Guard>
          <Guard permission="page:update">
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setAddCollabOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Collaborators
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setManageCollabOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              Manage Collaborators
            </DropdownMenuItem>
          </Guard>
          <Guard permission="page:delete">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (project?.id) archivePage({ pageId, projectId: project.id })
              }}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-danger-primary focus:text-danger-primary"
              onClick={() => {
                if (workspace?.id && project?.id)
                  deletePage({
                    pageId,
                    workspaceId: workspace.id,
                    projectId: project.id,
                  })
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </Guard>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddPageCollaboratorsDialog
        pageId={pageId}
        open={addCollabOpen}
        onOpenChange={setAddCollabOpen}
      />
      <ManageCollaboratorsDialog
        pageId={pageId}
        open={manageCollabOpen}
        onOpenChange={setManageCollabOpen}
      />
    </>
  )
}

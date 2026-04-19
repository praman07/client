import { useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import {
  closeDeleteProjectDialog,
  selectIsDeleteProjectDialogOpen,
} from '../model/slice'
import { useDeleteProject } from '../hooks/use-delete-project'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Input,
  Label,
} from '@/shared/ui'

interface DeleteProjectDialogProps {
  projectId: string
  projectName: string
  workspaceId: string
  workspaceSlug: string
}

export function DeleteProjectDialog({
  projectId,
  projectName,
  workspaceId,
  workspaceSlug,
}: DeleteProjectDialogProps) {
  const isOpen = useAppSelector(selectIsDeleteProjectDialogOpen)
  const dispatch = useAppDispatch()
  const [confirmText, setConfirmText] = useState('')
  const { mutate: deleteProject, isPending } = useDeleteProject(
    workspaceId,
    workspaceSlug,
  )

  const isConfirmed = confirmText.trim() === projectName.trim()

  function handleClose() {
    dispatch(closeDeleteProjectDialog())
    setConfirmText('')
  }

  function handleDelete() {
    if (!isConfirmed) return
    deleteProject(projectId, { onSuccess: handleClose })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          {/* Warning icon + title row */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-subtle">
              <TriangleAlert className="h-4 w-4 text-danger-primary" />
            </div>
            <AlertDialogTitle className="text-base">
              Delete Project
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-13 text-secondary pt-1">
            This will permanently delete{' '}
            <span className="font-medium text-primary">{projectName}</span>{' '}
            and all its issues, pages, boards, and data.{' '}
            <span className="font-medium text-danger-primary">
              This cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Confirmation input */}
        <div className="space-y-1.5 py-1">
          <Label htmlFor="confirm-delete" className="text-sm">
            Type{' '}
            <code className="rounded bg-layer-2 px-1 py-0.5 font-mono text-11 font-medium text-primary">
              {projectName}
            </code>{' '}
            to confirm
          </Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={projectName}
            autoComplete="off"
            className="font-mono text-14"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmed || isPending}
            className="bg-danger-primary hover:bg-danger-primary-hover text-on-color disabled:text-disabled disabled:pointer-events-none"
          >
            {isPending ? 'Deleting...' : 'Delete Project'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

import {
  closeLeaveProjectDialog,
  selectIsLeaveProjectDialogOpen,
} from '../model/slice'
import { useLeaveProject } from '../hooks/use-leave-project'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

interface LeaveProjectDialogProps {
  projectId: string
  workspaceSlug: string
  workspaceId: string
}

export function LeaveProjectDialog({
  projectId,
  workspaceSlug,
  workspaceId,
}: LeaveProjectDialogProps) {
  const isOpen = useAppSelector(selectIsLeaveProjectDialogOpen)
  const dispatch = useAppDispatch()
  const { mutate: leaveProject, isPending } = useLeaveProject(
    projectId,
    workspaceSlug,
    workspaceId,
  )

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => !open && dispatch(closeLeaveProjectDialog())}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Project</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose access to this project. A manager will need to re-add
            you.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              leaveProject(undefined as any, {
                onSuccess: () => dispatch(closeLeaveProjectDialog()),
              })
            }
            disabled={isPending}
            className="bg-danger-primary hover:bg-danger-primary-hover text-on-color"
          >
            {isPending ? 'Leaving...' : 'Leave Project'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

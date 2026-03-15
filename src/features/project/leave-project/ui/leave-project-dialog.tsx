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
import { useAppSelector, useAppDispatch } from '@/shared/hooks'
import {
  selectIsLeaveProjectDialogOpen,
  closeLeaveProjectDialog,
} from '../model/slice'
import { useLeaveProject } from '../hooks/use-leave-project'

interface LeaveProjectDialogProps {
  projectId: string
  workspaceSlug: string
}

export function LeaveProjectDialog({
  projectId,
  workspaceSlug,
}: LeaveProjectDialogProps) {
  const isOpen = useAppSelector(selectIsLeaveProjectDialogOpen)
  const dispatch = useAppDispatch()
  const { mutate: leaveProject, isPending } = useLeaveProject(
    projectId,
    workspaceSlug,
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
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Leaving...' : 'Leave Project'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

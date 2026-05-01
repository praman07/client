import { toast } from 'sonner'
import { useRemoveCollaborator } from '../hooks'
import { mapRemoveCollaboratorError } from '../lib'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'

interface Collaborator {
  userId: string
  user: {
    id: string
    fullName: string
    email: string
    avatarUrl: string | null
  }
}

interface RemoveCollaboratorDialogProps {
  boardId: string
  collaborator: Collaborator | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RemoveCollaboratorDialog({
  boardId,
  collaborator,
  open,
  onOpenChange,
}: RemoveCollaboratorDialogProps) {
  const { mutateAsync: removeCollaborator, isPending } = useRemoveCollaborator()

  const handleRemove = async () => {
    if (!collaborator) return

    try {
      await removeCollaborator({ boardId, userId: collaborator.userId })
      toast.success(`Removed ${collaborator.user.fullName}`)
      onOpenChange(false)
    } catch (error: unknown) {
      const message = mapRemoveCollaboratorError(error)
      toast.error(message)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!collaborator) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Collaborator?</AlertDialogTitle>
          <AlertDialogDescription>
            Remove this collaborator from the board? They will lose access
            immediately.
          </AlertDialogDescription>
          <div className="flex items-center gap-3 rounded-lg border p-3 mt-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={collaborator.user.avatarUrl || ''} />
              <AvatarFallback>
                {getInitials(collaborator.user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-14 font-medium text-primary">
                {collaborator.user.fullName}
              </span>
              <span className="text-12 text-secondary">
                {collaborator.user.email}
              </span>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleRemove()
            }}
            disabled={isPending}
            className="bg-danger-primary text-on-color hover:bg-danger-primary-hover"
          >
            {isPending ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

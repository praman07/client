import { Loader2 } from 'lucide-react'
import { useUnarchiveChannel } from '../hooks'
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

interface UnarchiveChannelDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  channelId: string
  channelName: string
  workspaceId: string
  projectId?: string
  onSuccess?: () => void
}

export function UnarchiveChannelDialog({
  isOpen,
  onOpenChange,
  channelId,
  channelName,
  workspaceId,
  projectId,
  onSuccess,
}: UnarchiveChannelDialogProps) {
  const { mutate: unarchiveChannel, isPending } = useUnarchiveChannel()

  const handleUnarchive = () => {
    unarchiveChannel(
      { workspaceId, projectId, channelId },
      {
        onSuccess: () => {
          onOpenChange(false)
          onSuccess?.()
        },
      },
    )
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unarchive this channel?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              When you unarchive{' '}
              <span className="font-semibold">#{channelName}</span>, it will be
              restored for everyone:
            </p>
            <ul className="space-y-1.5 text-sm text-secondary">
              <li>• The channel will reappear in the sidebar</li>
              <li>• Members can send messages again</li>
              <li>• All message history is already preserved</li>
              <li>• The channel will function normally</li>
            </ul>
            <p className="text-sm text-secondary">Would you like to unarchive this channel?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleUnarchive()
            }}
            disabled={isPending}
            className="bg-success-primary hover:bg-success-primary-hover text-on-color"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Unarchive Channel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

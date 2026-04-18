import { Loader2 } from 'lucide-react'
import { useArchiveChannel } from '../hooks'
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

interface ArchiveChannelDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  channelId: string
  channelName: string
  onSuccess?: () => void
}

export function ArchiveChannelDialog({
  isOpen,
  onOpenChange,
  channelId,
  channelName,
  onSuccess,
}: ArchiveChannelDialogProps) {
  const { mutate: archiveChannel, isPending } = useArchiveChannel()

  const handleArchive = () => {
    archiveChannel(
      { channelId },
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
          <AlertDialogTitle>Archive this channel?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              When you archive{' '}
              <span className="font-semibold text-primary">#{channelName}</span>, it's
              archived for everyone. That means:
            </p>
            <ul className="space-y-1.5 text-13 text-secondary">
              <li>• No one will be able to send messages to the channel</li>
              <li>• The channel will be hidden from the sidebar</li>
              <li>• All message history will be preserved</li>
              <li>• You can unarchive the channel anytime in the future</li>
            </ul>
            <p className="text-13 text-secondary">
              You'll still be able to find the channel's contents via search.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleArchive()
            }}
            disabled={isPending}
            className="bg-warning-primary hover:bg-warning-primary/90 text-on-color"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Archive Channel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

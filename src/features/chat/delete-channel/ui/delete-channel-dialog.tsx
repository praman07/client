import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useDeleteChannel } from '../hooks'
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
import { Checkbox } from '@/shared/ui/primitives/checkbox'
import { Label } from '@/shared/ui/primitives/label'

interface DeleteChannelDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  channelId: string
  channelName: string
  workspaceId: string
  projectId?: string
  isArchived: boolean
  onSuccess?: () => void
}

export function DeleteChannelDialog({
  isOpen,
  onOpenChange,
  channelId,
  channelName,
  workspaceId,
  projectId,
  isArchived,
  onSuccess,
}: DeleteChannelDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { mutate: deleteChannel, isPending } = useDeleteChannel()

  const handleDelete = () => {
    deleteChannel(
      { workspaceId, projectId, channelId },
      {
        onSuccess: () => {
          onOpenChange(false)
          setIsConfirmed(false)
          onSuccess?.()
        },
      },
    )
  }

  // Reset confirmation when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsConfirmed(false)
    }
    onOpenChange(open)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete channel?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              When you delete{' '}
              <span className="font-semibold">#{channelName}</span>, all
              messages from this channel will be removed from Collabify
              immediately. This can't be undone.
            </p>
            <div className="text-sm">
              <p className="font-medium mb-2">Keep in mind that:</p>
              <ul className="space-y-1.5">
                <li>
                  • Any files uploaded to this channel won't be removed from
                  storage
                </li>
                <li>
                  • You can archive a channel instead without removing its
                  messages
                </li>
                <li>• This action is permanent and cannot be reversed</li>
              </ul>
            </div>

            {!isArchived && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                ⚠️ Channel must be archived before deletion
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="delete-confirm"
                checked={isConfirmed}
                onCheckedChange={(checked) => setIsConfirmed(checked === true)}
                disabled={!isArchived || isPending}
              />
              <Label
                htmlFor="delete-confirm"
                className="text-sm font-normal cursor-pointer select-none"
              >
                I understand this action cannot be undone
              </Label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={!isConfirmed || !isArchived || isPending}
            className="bg-danger-primary hover:bg-danger-primary-hover"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, permanently delete the channel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

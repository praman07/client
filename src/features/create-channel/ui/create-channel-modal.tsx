import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui'
import { CreateChannelForm } from './create-channel-form'
import { ReactNode, useState } from 'react'

interface CreateChannelModalProps {
  children: ReactNode
  workspaceId: string
  projectId?: string
}

export function CreateChannelModal({
  children,
  workspaceId,
  projectId,
}: CreateChannelModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create a new channel to start a conversation.
          </DialogDescription>
        </DialogHeader>
        <CreateChannelForm
          workspaceId={workspaceId}
          projectId={projectId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

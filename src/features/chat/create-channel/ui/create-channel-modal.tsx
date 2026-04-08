import { useCreateChannelModal } from '..'
import { CreateChannelForm } from './create-channel-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'

export function CreateChannelModal() {
  const { isOpen, close } = useCreateChannelModal()
  const project = useAppSelector(selectCurrentProject)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-lg w-[calc(100vw-2rem)] flex flex-col p-0 gap-0 overflow-hidden bg-background border-border">
        <DialogHeader className="px-6 pt-5 pb-4 shrink-0 border-b border-border">
          <DialogTitle className="text-base font-semibold text-foreground">
            Create a channel
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            Channels are where your team communicates on a topic.
          </p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isOpen && project ? (
            <CreateChannelForm
              workspaceId={project.workspaceId}
              projectId={project.id}
              onSuccess={close}
            />
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Loading project context…
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

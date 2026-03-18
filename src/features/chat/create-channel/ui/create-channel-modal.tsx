import { useCreateChannelModal } from '..'
import { CreateChannelForm } from './create-channel-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Add a new channel to your project.
          </DialogDescription>
        </DialogHeader>
        {project ? (
          <CreateChannelForm
            workspaceId={project.workspaceId}
            projectId={project.id}
            onSuccess={close}
          />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Loading project context...
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

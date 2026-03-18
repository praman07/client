import { useCreateProjectModal } from '../hooks'
import { CreateProjectForm } from './create-project-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentWorkspace } from '@/entities/workspace'

export function CreateProjectModal() {
  const { isOpen, close } = useCreateProjectModal()
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  if (!currentWorkspace) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace{' '}
            <strong>{currentWorkspace.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm
          workspaceId={currentWorkspace.id}
          onSuccess={close}
        />
      </DialogContent>
    </Dialog>
  )
}

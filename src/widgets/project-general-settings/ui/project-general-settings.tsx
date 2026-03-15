import { Button, Separator, Badge } from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { UpdateProjectForm } from '@/features/project/update-project/ui/update-project-form'
import { DeleteProjectDialog } from '@/features/project/delete-project/ui/delete-project-dialog'
import { openDeleteProjectDialog } from '@/features/project/delete-project/model/slice'
import {
  useArchiveProject,
  useUnarchiveProject,
} from '@/features/project/archive-project/hooks/use-archive-project'
import {
  selectCurrentProject,
  selectCurrentProjectIsArchived,
} from '@/entities/project'

interface ProjectGeneralSettingsProps {
  workspaceId: string
  workspaceSlug: string
}

export function ProjectGeneralSettings({
  workspaceId,
  workspaceSlug,
}: ProjectGeneralSettingsProps) {
  const dispatch = useAppDispatch()
  const project = useAppSelector(selectCurrentProject)
  const isArchived = useAppSelector(selectCurrentProjectIsArchived)
  const { mutate: archive, isPending: archiving } = useArchiveProject()
  const { mutate: unarchive, isPending: unarchiving } = useUnarchiveProject()

  if (!project) return null

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Project Info */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="text-sm font-semibold">Project Info</h3>
            <p className="text-sm text-muted-foreground">
              Update your project's name and description.
            </p>
          </div>
          {isArchived && (
            <Badge variant="secondary" className="ml-auto shrink-0">
              Archived
            </Badge>
          )}
        </div>
        <UpdateProjectForm
          projectId={project.id}
          workspaceId={workspaceId}
          defaultValues={{
            name: project.name,
            description: project.description ?? '',
          }}
        />
      </section>

      <Separator />

      {/* Danger Zone */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            These actions are irreversible. Proceed with caution.
          </p>
        </div>

        <div className="rounded-lg border border-destructive/30 divide-y divide-destructive/20">
          {/* Archive / Unarchive */}
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {isArchived ? 'Unarchive project' : 'Archive project'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isArchived
                  ? 'Restore project to active status.'
                  : 'Make this project read-only and hide it from active views.'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              disabled={archiving || unarchiving}
              onClick={() =>
                isArchived ? unarchive(project.id) : archive(project.id)
              }
            >
              {isArchived ? 'Unarchive' : 'Archive'}
            </Button>
          </div>

          {/* Delete */}
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Delete project</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete this project and all its data. This cannot be
                undone.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => dispatch(openDeleteProjectDialog())}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </section>

      {/* Dialogs — mounted here, driven by Redux */}
      <DeleteProjectDialog
        projectId={project.id}
        projectName={project.name}
        workspaceId={workspaceId}
        workspaceSlug={workspaceSlug}
      />
    </div>
  )
}

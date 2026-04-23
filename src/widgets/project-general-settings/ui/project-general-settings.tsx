import { useQueryClient } from '@tanstack/react-query'
import { ProjectGeneralForm } from './project-general-form'
import { Badge, Button, Separator } from '@/shared/ui'
import { useAppDispatch, useAppSelector, useAuth } from '@/shared/hooks'
import { Guard } from '@/shared/lib/auth'
import {
  DeleteProjectDialog,
  openDeleteProjectDialog,
} from '@/features/project/delete-project'
import {
  useArchiveProject,
  useUnarchiveProject,
} from '@/features/project/archive-project'
import {
  projectKeys,
  selectCurrentProject,
  selectCurrentProjectIsArchived,
} from '@/entities/project'
import { useProjectDetails } from '@/entities/project/hooks'

interface ProjectGeneralSettingsProps {
  workspaceId: string
  workspaceSlug: string
  projectSlug: string
}

export function ProjectGeneralSettings({
  workspaceId,
  workspaceSlug,
}: ProjectGeneralSettingsProps) {
  const dispatch = useAppDispatch()
  const project = useAppSelector(selectCurrentProject)
  const isArchived = useAppSelector(selectCurrentProjectIsArchived)
  const queryClient = useQueryClient()

  const { data: projectData, isLoading } = useProjectDetails(project?.id ?? '', workspaceId)

  const { mutate: archive, isPending: archiving } = useArchiveProject()
  const { mutate: unarchive, isPending: unarchiving } = useUnarchiveProject()

  const handleArchive = () => {
    if (!project?.id) return
    archive(project.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: projectKeys.list(workspaceId),
        })
      },
    })
  }

  const handleUnarchive = () => {
    if (!project?.id) return
    unarchive(project.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: projectKeys.list(workspaceId),
        })
      },
    })
  }

  if (isLoading || !project) return null

  return (
    <div className="space-y-8 max-w-4xl">
      {/* ── General Settings ──────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold">General Settings</h3>
            <p className="text-sm text-secondary">
              Update your project's name, key, description and icon.
            </p>
          </div>
          {isArchived && (
            <Badge variant="default" className="ml-auto shrink-0">
              Archived
            </Badge>
          )}
        </div>

        <Guard permission="project:update">
          <ProjectGeneralForm
            project={projectData ?? project}
            workspaceId={workspaceId}
            workspaceSlug={workspaceSlug}
          />
        </Guard>
      </section>

      <Separator />

      {/* ── Danger Zone ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-14 font-semibold">Danger Zone</h3>
          <p className="text-14 text-secondary">
            These actions are irreversible. Proceed with caution.
          </p>
        </div>

        <div className="rounded-lg border border-danger-subtle divide-y divide-danger-subtle">
          {/* Archive / Unarchive */}
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="min-w-0">
              <p className="text-14 font-medium">
                {isArchived ? 'Unarchive project' : 'Archive project'}
              </p>
              <p className="text-12 text-secondary">
                {isArchived
                  ? 'Restore project to active status.'
                  : 'Make this project read-only and hide it from active views.'}
              </p>
            </div>
            <Guard permission="project:archive">
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                disabled={archiving || unarchiving}
                onClick={isArchived ? handleUnarchive : handleArchive}
              >
                {isArchived ? 'Unarchive' : 'Archive'}
              </Button>
            </Guard>
          </div>

          {/* Delete */}
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Delete project</p>
              <p className="text-xs text-secondary">
                Permanently delete this project and all its data. This cannot be
                undone.
              </p>
            </div>
            <Guard permission="project:delete">
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-danger-primary border-danger-subtle hover:bg-danger-subtle hover:text-danger-primary"
                onClick={() => dispatch(openDeleteProjectDialog())}
              >
                Delete Project
              </Button>
            </Guard>
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

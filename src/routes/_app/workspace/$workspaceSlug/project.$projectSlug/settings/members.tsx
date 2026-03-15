import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector, useAuth } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { selectCurrentWorkspace } from '@/entities/workspace/model/selectors'
import { ProjectMembersTable } from '@/widgets/project-members-table'
import { Skeleton } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/settings/members',
)({
  component: MembersSettingsPage,
})

function MembersSettingsPage() {
  const { workspaceSlug } = Route.useParams()
  const project = useAppSelector(selectCurrentProject)
  const workspace = useAppSelector(selectCurrentWorkspace)
  const { userId: currentUserId } = useAuth()

  if (!project || !workspace) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="h-48 w-full rounded-md" />
      </div>
    )
  }

  return (
    <ProjectMembersTable
      projectId={project.id}
      workspaceId={workspace.id}
      workspaceSlug={workspaceSlug}
      currentUserId={currentUserId ?? undefined}
    />
  )
}

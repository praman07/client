import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { ProjectMembersTable } from '@/widgets/project-members-table'
import { MembersPageSkeleton, WidgetError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/settings/members',
)({
  component: MembersSettingsPage,
})

function MembersSettingsPage() {
  const { workspaceSlug } = Route.useParams()
  const project = useAppSelector(selectCurrentProject)
  const workspace = useAppSelector(selectCurrentWorkspace)

  if (!project || !workspace) {
    return <MembersPageSkeleton />
  }

  return (
    <ErrorBoundary FallbackComponent={WidgetError}>
      <ProjectMembersTable
        projectId={project.id}
        workspaceId={workspace.id}
        workspaceSlug={workspaceSlug}
      />
    </ErrorBoundary>
  )
}

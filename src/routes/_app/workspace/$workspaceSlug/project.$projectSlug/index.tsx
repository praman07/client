import { createFileRoute } from '@tanstack/react-router'
import { OverviewPage } from '@/pages/project'
import { PROJECT_FRAGMENT, useProjectBySlug } from '@/entities/project'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { useFragment } from '@/gql'
import { PageSpinner, RouteError } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/',
)({
  component: ProjectOverview,
})

function ProjectOverview() {
  const { workspaceSlug, projectSlug } = Route.useParams()

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )

  const { data, isLoading, error } = useProjectBySlug(workspace?.id || '', projectSlug)
  const project = useFragment(PROJECT_FRAGMENT, data?.projectBySlug)

  if (isLoading || !workspace) {
    return <PageSpinner label="Loading context..." />
  }

  if (error || !project) {
    return <RouteError error={error || new Error('Project not found')} />
  }

  return (
    <OverviewPage
      projectId={project.id}
      projectSlug={projectSlug}
      workspaceId={workspace.id}
      workspaceSlug={workspaceSlug}
      name={project.name}
      projectKey={project.key}
      description={project.description ?? null}
      isPrivate={project.isPrivate ?? null}
      isArchived={project.isArchived ?? null}
      activePlugins={project.activePlugins}
    />
  )
}

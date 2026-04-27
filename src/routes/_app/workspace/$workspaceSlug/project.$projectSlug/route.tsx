import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useProjectSync } from './-hooks/use-project-sync'
import { usePluginUpdateListener } from './-hooks/use-plugin-update-listener'
import type { WorkspacePartial } from '@/entities/workspace'
import { NavTabs, ProjectSwitcher } from '@/widgets/navigation'
import { buildProjectNav } from '@/shared/config/navigation'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import {
  PROJECT_FRAGMENT,
  ProjectErrorState,
  ProjectLoadingState,
  useProjectBySlug,
  useProjectContextSwitch,
} from '@/entities/project'
import { useFragment } from '@/gql'
import { DomainRegistry } from '@/app/providers/ws-domains'
import { PageSpinner, RouteError } from '@/shared/ui'
import { CreateProjectRoleDialog } from '@/features/project/create-project-role'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug',
)({
  component: ProjectBaseLayout,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
  staticData: {
    breadcrumb: () => <ProjectSwitcher />,
  },
})

function ProjectBaseLayout() {
  const { workspaceSlug, projectSlug } = Route.useParams()

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )

  if (!workspace) {
    return <PageSpinner label="Loading project…" />
  }

  return (
    <ProjectLayout
      workspace={workspace}
      projectSlug={projectSlug}
      workspaceSlug={workspaceSlug}
    />
  )
}

interface ProjectLayoutProps {
  workspace: WorkspacePartial
  projectSlug: string
  workspaceSlug: string
}

function ProjectLayout({
  workspace,
  projectSlug,
  workspaceSlug,
}: ProjectLayoutProps) {
  const { data, isLoading, error } = useProjectBySlug(workspace.id, projectSlug)
  const project = useFragment(PROJECT_FRAGMENT, data?.projectBySlug)

  // Side effects delegated to named hooks — one responsibility each
  useProjectSync(project ?? null)
  usePluginUpdateListener(project?.id, workspace.id, projectSlug)

  // Purge stale project-scoped cache when the user navigates to a different project.
  // Fires synchronously before re-render — new project gets fresh data, not leftovers.
  useProjectContextSwitch(project?.id)

  if (isLoading) {
    return <ProjectLoadingState />
  }

  if (error || !project) {
    return <ProjectErrorState workspaceSlug={workspaceSlug} />
  }
  const navItems = buildProjectNav(project.activePlugins)

  return (
    <div className="flex h-full flex-col">
      <DomainRegistry />
      <NavTabs items={navItems} from={Route.fullPath} />
      <div className="flex-1 overflow-hidden relative">
        <ErrorBoundary
          FallbackComponent={({ error: err, resetErrorBoundary }) => (
            <RouteError error={err} reset={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Project-scoped modal registry — portaled to <body>, zero visual impact */}
      <CreateProjectRoleDialog projectId={project.id} workspaceId={workspace.id} existingRoleNames={[]} />
    </div>
  )
}

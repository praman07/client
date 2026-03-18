import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { NavTabs, ProjectSwitcher } from '@/widgets/navigation'
import { PROJECT_TABS } from '@/shared/config/navigation'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import {
  PROJECT_FRAGMENT,
  ProjectErrorState, ProjectLoadingState , clearCurrentProject ,
  setCurrentProject,
  useProjectBySlug
} from '@/entities/project'
import { useFragment } from '@/gql'
import { DomainRegistry } from '@/app/providers/ws-domains'
import { PageSpinner, ProjectLayoutSkeleton, RouteError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug',
)({
  component: ProjectBaseLayout,
  pendingComponent: ProjectLayoutSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
  staticData: {
    breadcrumb: () => <ProjectSwitcher />,
  },
})

function ProjectBaseLayout() {
  const params = Route.useParams()
  const { workspaceSlug, projectSlug } = params
  const dispatch = useAppDispatch()

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )

  const { data, isLoading, error } = useProjectBySlug(
    workspace?.id || '',
    projectSlug,
  )
  const project = useFragment(PROJECT_FRAGMENT, data?.projectBySlug)

  useEffect(() => {
    if (project) {
      dispatch(setCurrentProject(project))
    }
  }, [project, dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearCurrentProject())
    }
  }, [dispatch])

  // Workspace context is still resolving from Redux (parent layout sync)
  if (!workspace && !error) {
    return <PageSpinner label="Loading workspace…" />
  }

  // Project fetch in-progress
  if (isLoading) {
    return <ProjectLoadingState />
  }

  if (error || !project) {
    return <ProjectErrorState workspaceSlug={workspaceSlug} />
  }

  return (
    <div className="flex h-full flex-col">
      <DomainRegistry projectId={project.id} />
      <div className="shrink-0 border-b bg-background px-6">
        <NavTabs items={PROJECT_TABS as any} from={Route.fullPath} />
      </div>
      {/* Wrap child routes in Suspense + ErrorBoundary */}
      <div className="flex-1 overflow-hidden relative">
        <ErrorBoundary FallbackComponent={({ error: err, resetErrorBoundary }) => (
          <RouteError error={err} reset={resetErrorBoundary} />
        )}>
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

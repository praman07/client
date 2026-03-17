import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SidebarInset, SidebarProvider } from '@/shared/ui/primitives/sidebar'
import { PageSidebar } from '@/widgets/page-list'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'
import { PageSpinner, PagesSkeleton, RouteError, WidgetError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/pages',
)({
  component: PagesLayout,
  pendingComponent: PagesSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

/**
 * Pages layout — SidebarProvider + PageSidebar + SidebarInset + Outlet.
 * IDs resolved from Redux (same pattern as whiteboard/index.tsx).
 */
function PagesLayout() {
  const { workspaceSlug } = Route.useParams()

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const project = useAppSelector(selectCurrentProject)

  if (!workspace?.id || !project?.id) {
    return <PageSpinner label="Loading workspace…" />
  }

  return (
    <SidebarProvider
      style={{ '--sidebar-width': '260px' } as React.CSSProperties}
      className="h-full w-full overflow-hidden"
    >
      {/* Sidebar gets its own ErrorBoundary so a sidebar failure doesn't kill the editor */}
      <ErrorBoundary FallbackComponent={WidgetError}>
        <PageSidebar workspaceId={workspace.id} projectId={project.id} />
      </ErrorBoundary>

      <SidebarInset className="flex h-full flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-background translate-z-0">
          {/* Each page route (editor/index) gets Suspense + ErrorBoundary at the outlet level */}
          <ErrorBoundary FallbackComponent={({ error, resetErrorBoundary }) => (
            <RouteError error={error} reset={resetErrorBoundary} />
          )}>
            <Suspense fallback={<PageSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

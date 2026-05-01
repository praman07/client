import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Suspense, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryClient } from '@tanstack/react-query'
import { SidebarInset, SidebarProvider } from '@/shared/ui/primitives/sidebar'
import { PageSidebar } from '@/widgets/page-list'
import { useAppDispatch, useAppSelector, useUser } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { PageSpinner, PagesSkeleton, RouteError, WidgetError } from '@/shared/ui'
import { createPagesPlugin } from '@/app/providers/ws-domains/pages-plugin'
import { registerPlugin, unregisterPlugin } from '@/shared/ws/domains'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/pages',
)({
  component: PagesLayout,
  pendingComponent: PagesSkeleton,
  beforeLoad: ({ context }) => {
    const activePlugins: Array<string> = (context as any)?.project?.activePlugins ?? []
    if (activePlugins.length > 0 && !activePlugins.includes('PAGES')) {
      throw redirect({ to: '/' as any, search: { pluginDisabled: 'PAGES' } as any })
    }
  },
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

/**
 * Pages layout — SidebarProvider + PageSidebar + SidebarInset + Outlet.
 *
 * Owns the pages WS domain plugin lifecycle — the plugin is registered only
 * while the user is inside the /pages route subtree (YJS awareness, editor sync).
 */
function PagesLayout() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { user } = useUser()

  // Read workspace and project from Redux — both set by parent ProjectBaseLayout
  // before this component mounts, so they are available on first render.
  // V16 fix: removed workspaceSlug re-lookup via Route.useParams() + selector chain;
  // workspace.id is sourced from selectCurrentProject which already carries it.
  const project = useAppSelector(selectCurrentProject)

  // Stable ref — holds latest userId without triggering plugin re-registration
  const userIdRef = useRef(user?.id ?? null)
  useEffect(() => {
    userIdRef.current = user?.id ?? null
  }, [user?.id])

  // V14 fix: guard plugin registration — only register when project context is ready.
  // dispatch and queryClient are stable refs; plugin lifecycle tied to route lifetime.
   
  useEffect(() => {
    if (!project?.id) return

    const plugin = createPagesPlugin({
      dispatch,
      queryClient,
      userId: userIdRef.current,
    })
    registerPlugin(plugin)
    return () => unregisterPlugin('pages')
  }, [project?.id, dispatch, queryClient])

  if (!project?.id) {
    return <PageSpinner label="Loading Pages…" />
  }

  return (
    <SidebarProvider
      style={{ '--sidebar-width': '260px' } as React.CSSProperties}
      className="h-full w-full overflow-hidden"
    >
      {/* Sidebar gets its own ErrorBoundary so a sidebar failure doesn't kill the editor */}
      <ErrorBoundary FallbackComponent={WidgetError}>
        <PageSidebar projectId={project.id} />
      </ErrorBoundary>

      <SidebarInset className="flex h-full flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
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

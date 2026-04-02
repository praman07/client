import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Suspense, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SidebarInset } from '@/shared/ui/primitives/sidebar'
import { ChatSidebar, SidebarProvider } from '@/widgets/chat-sidebar'
import { ChatPluginSkeleton, PageSpinner, RouteError, WidgetError } from '@/shared/ui'
import { useAppSelector, useUser } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { createChatPlugin } from '@/app/providers/ws-domains/chat-plugin'
import { registerPlugin, unregisterPlugin } from '@/shared/ws/domains'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat',
)({
  component: ChatLayout,
  pendingComponent: ChatPluginSkeleton,
  beforeLoad: ({ context }) => {
    // Guard: CHAT plugin must be active. activePlugins is populated
    // after setCurrentProject() runs in the parent ProjectBaseLayout.
    // On first load the parent runs first, so this is reliable.
    const activePlugins: Array<string> = (context as any)?.project?.activePlugins ?? []
    if (activePlugins.length > 0 && !activePlugins.includes('CHAT')) {
      throw redirect({ to: '/' as any, search: { pluginDisabled: 'CHAT' } as any })
    }
  },
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function ChatLayout() {
  const { user } = useUser()
  const project = useAppSelector(selectCurrentProject)

  // Stable refs — always hold the latest value without triggering re-registration
  const projectRef = useRef(project)
  const userRef = useRef(user)
  useEffect(() => {
    projectRef.current = project
    userRef.current = user
  }, [project, user])

  // Plugin lifecycle is tied to route mount/unmount, not data identity.
  // Closures read from refs so they always see the latest value.
   
  useEffect(() => {
    const plugin = createChatPlugin({
      getProjectId: () => projectRef.current?.id,
      getCurrentUserId: () => userRef.current?.id ?? '',
    })
    registerPlugin(plugin)
    return () => unregisterPlugin('chat')
  }, [])

  return (
    <SidebarProvider
      style={{ '--sidebar-width': '240px' } as React.CSSProperties}
      className="h-full w-full overflow-hidden"
    >
      {/* Sidebar gets its own boundary — a failure won't kill the conversation view */}
      <ErrorBoundary FallbackComponent={WidgetError}>
        <ChatSidebar />
      </ErrorBoundary>

      <SidebarInset className="flex h-full flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-background translate-z-0">
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

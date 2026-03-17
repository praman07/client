import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SidebarInset } from '@/shared/ui/primitives/sidebar'
import { ChatSidebar, SidebarProvider } from '@/widgets/chat-sidebar'
import { PageSpinner, RouteError, WidgetError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat',
)({
  component: ChatLayout,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function ChatLayout() {
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

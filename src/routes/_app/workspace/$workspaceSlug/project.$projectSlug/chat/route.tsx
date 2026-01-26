import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SidebarInset } from '@/shared/ui/primitives/sidebar' // Import SidebarInset
import { ChatSidebar, SidebarProvider } from '@/widgets/chat-sidebar'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat',
)({
  component: ChatLayout,
})

function ChatLayout() {
  return (
    <SidebarProvider
      style={{ '--sidebar-width': '240px' } as React.CSSProperties}
      className="h-full w-full overflow-hidden"
    >
      <ChatSidebar />
      <SidebarInset className="flex h-full flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-background translate-z-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

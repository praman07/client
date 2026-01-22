import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarInset } from '@/shared/ui/primitives/sidebar' // Import SidebarInset
import {
  ChatSidebar,
  SidebarProvider,
  SidebarTrigger,
} from '@/widgets/chat-sidebar'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/chat',
)({
  component: ChatLayout,
})

function ChatLayout() {
  return (
    <SidebarProvider
      style={{ '--sidebar-width': '240px' } as React.CSSProperties}
      className="h-screen w-full overflow-hidden"
    >
      <ChatSidebar />
      <SidebarInset className="flex h-full flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger />
        </header>

        <main className="flex-1 overflow-hidden bg-background">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

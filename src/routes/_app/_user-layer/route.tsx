import { Outlet, createFileRoute } from '@tanstack/react-router'
import { UserSidebar } from '@/widgets/user-sidebar'
import { SidebarInset, SidebarProvider } from '@/shared/ui/primitives/sidebar'

export const Route = createFileRoute('/_app/_user-layer')({
  component: UserLayerLayout,
})

function UserLayerLayout() {
  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto w-full relative selection:bg-primary/20">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

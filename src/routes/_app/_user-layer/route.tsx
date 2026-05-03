import { Outlet, createFileRoute } from '@tanstack/react-router'
import { UserSidebar } from '@/widgets/user-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shared/ui/primitives/sidebar'

export const Route = createFileRoute('/_app/_user-layer')({
  component: UserLayerLayout,
})

function UserLayerLayout() {
  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset className="h-screen">
        <SidebarTrigger className="absolute top-3 left-2 z-10 hidden md:flex" />
        <main className="flex-1 flex flex-col min-h-0 min-w-0 w-full relative selection:bg-primary/20 overflow-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug')({
  component: WorkspaceRailLayout,
})

function WorkspaceRailLayout() {
  const { workspaceSlug } = Route.useParams()
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Visual Placeholder: Navigation Rail */}
      <aside className="fixed left-0 top-0 z-30 h-full w-16 border-r bg-muted flex flex-col items-center py-4">
         <div className="h-10 w-10 rounded-lg bg-primary/20 text-xs flex items-center justify-center font-bold">
            WS
         </div>
         <div className="mt-auto h-8 w-8 rounded-full bg-accent"></div>
      </aside>

      {/* Main Content Area (Pushed over by rail) */}
      <div className="ml-16 flex flex-1 flex-col overflow-hidden">
        <div className="p-2 border-b bg-muted/10 text-xs text-muted-foreground">
            Current Workspace: {workspaceSlug}
        </div>
        <Outlet />
      </div>
    </div>
  )
}

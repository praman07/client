import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/project/$projectId/board')({
  component: BoardLayout,
})

function BoardLayout() {
  return (
    <div className="flex h-full flex-col">
       <div className="h-12 border-b bg-card px-4 flex items-center shadow-sm">
          <span className="font-semibold">Board Toolbar</span>
          <div className="ml-auto text-xs text-muted-foreground">Filter | Sort | Group</div>
       </div>
       <div className="flex-1 overflow-auto bg-muted/20 p-4">
          <Outlet />
       </div>
    </div>
  )
}

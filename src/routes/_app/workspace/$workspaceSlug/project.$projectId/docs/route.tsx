import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/project/$projectId/docs')({
  component: DocsLayout,
})

function DocsLayout() {
  return (
    <div className="flex h-full">
       <aside className="w-64 border-r bg-muted/10 p-4">
          <h4 className="mb-4 font-bold text-sm">Pages</h4>
       </aside>
       <main className="flex-1 p-8 max-w-4xl mx-auto">
          <Outlet />
       </main>
    </div>
  )
}

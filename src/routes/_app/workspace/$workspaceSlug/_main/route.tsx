import { createFileRoute, Outlet, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main')({
  component: WorkspaceMainLayout,
})

function WorkspaceMainLayout() {
  const { workspaceSlug } = Route.useParams()
  
  return (
    <div className="flex h-full">
      {/* Visual Placeholder: Workspace Sidebar */}
      <aside className="w-64 border-r bg-card p-4">
        <h3 className="mb-4 font-bold px-2">Workspace Main</h3>
        <nav className="space-y-1">
            <Link to="/workspace/$workspaceSlug" params={{ workspaceSlug }} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Dashboard</Link>
            <Link to="/workspace/$workspaceSlug/projects" params={{ workspaceSlug }} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Projects</Link>
            <Link to="/workspace/$workspaceSlug/members" params={{ workspaceSlug }} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Members</Link>
            <Link to="/workspace/$workspaceSlug/settings" params={{ workspaceSlug }} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto bg-background p-8">
        <Outlet />
      </main>
    </div>
  )
}

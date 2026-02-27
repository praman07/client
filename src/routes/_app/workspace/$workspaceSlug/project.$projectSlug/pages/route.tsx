import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/shared/ui/primitives/sidebar'
import { PageSidebar } from '@/widgets/page-list'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace/model/selectors'
import { selectCurrentProject } from '@/entities/project/model/selectors'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/pages',
)({
  component: PagesLayout,
})

/**
 * Pages layout — SidebarProvider + PageSidebar + SidebarInset + Outlet.
 *
 * Mirrors chat/route.tsx but adds a left sidebar (page tree).
 * IDs resolved from Redux (same pattern as whiteboard/index.tsx).
 */
function PagesLayout() {
  const { workspaceSlug } = Route.useParams()

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const project = useAppSelector(selectCurrentProject)

  if (!workspace?.id || !project?.id) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p className="text-sm">Loading workspace…</p>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={{ '--sidebar-width': '260px' } as React.CSSProperties}
      className="h-full w-full overflow-hidden"
    >
      <PageSidebar workspaceId={workspace.id} projectId={project.id} />
      <SidebarInset className="flex h-full flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-background translate-z-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

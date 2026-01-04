import { Outlet, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { DashboardHeader } from '@/widgets/navigation/ui/dashboard-header'
import { WorkspaceSwitcher } from '@/widgets/navigation/ui/workspace-switcher'

const workspaceSearchSchema = z.object({
  action: z.enum(['create-project']).optional(),
})

export const Route = createFileRoute('/_app/workspace/$workspaceSlug')({
  component: RouteComponent,
  validateSearch: (search) => workspaceSearchSchema.parse(search),
  staticData: {
    breadcrumb: () => <WorkspaceSwitcher />,
  },
})

function RouteComponent() {
  // Removed unused params extraction

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TIER 1: GLOBAL HEADER */}
      <DashboardHeader/>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RouteError } from '@/shared/ui'
import { WorkspaceLayout } from '@/pages/workspace'
import { WorkspaceSwitcher } from '@/widgets/navigation'

const workspaceSearchSchema = z.object({
  action: z.enum(['create-project']).optional(),
})

export const Route = createFileRoute('/_app/workspace/$workspaceSlug')({
  component: WorkspaceLayoutRouteComponent,
  errorComponent: RouteError,
  validateSearch: (search) => workspaceSearchSchema.parse(search),
  staticData: {
    breadcrumb: () => <WorkspaceSwitcher />,
  },
})

function WorkspaceLayoutRouteComponent() {
  const { workspaceSlug } = Route.useParams()
  return <WorkspaceLayout workspaceSlug={workspaceSlug} />
}

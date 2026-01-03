import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { CreateProjectModal } from '@/features/project/create-project-modal'

const workspaceSearchSchema = z.object({
  action: z.enum(['create-project']).optional(),
})

export const Route = createFileRoute('/_app/workspace/$workspaceSlug')({
  component: WorkspaceRailLayout,
  validateSearch: (search) => workspaceSearchSchema.parse(search),
})

function WorkspaceRailLayout() {
  const { workspaceSlug } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()

  const isCreateProjectOpen = search.action === 'create-project'

  const handleCloseModal = () => {
    // Remove the action param
    navigate({
        to: '.',
        params: { workspaceSlug },
        search: {},
        replace: true
    })
  }
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">

      {/* Main Content Area (Pushed over by rail) */}
      <div className="ml-16 flex flex-1 flex-col overflow-hidden">
        <div className="p-2 border-b bg-muted/10 text-xs text-muted-foreground">
            Current Workspace: {workspaceSlug}
        </div>
        <Outlet />
      </div>
      
      <CreateProjectModal 
        isOpen={isCreateProjectOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  )
}

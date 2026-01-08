import { createFileRoute } from '@tanstack/react-router'
import { CreateWorkspaceForm } from '@/features/create-workspace/ui/create-workspace-form'

export const Route = createFileRoute('/_app/workspace/new')({
  component: WorkspaceNewPage,
})

function WorkspaceNewPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <CreateWorkspaceForm />
    </div>
  )
}

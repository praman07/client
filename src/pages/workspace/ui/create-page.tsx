import { ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { CreateWorkspaceForm } from '@/features/create-workspace'

export function CreateWorkspacePage() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: '/home' })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-1 p-4">
      <div className="w-full max-w-[600px]">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-13 font-medium text-secondary bg-layer-transparent hover:bg-layer-transparent-hover hover:text-primary transition-colors duration-100"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>
        <CreateWorkspaceForm />
      </div>
    </div>
  )
}

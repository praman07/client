import { ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { CreateWorkspaceForm } from '@/features/create-workspace'
import { Button } from '@/shared/ui'

export function CreateWorkspacePage() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate({ to: '/home' })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-1 p-4">
      <div className="w-full max-w-[600px] animate-fade-in">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="-ml-2 text-secondary hover:text-primary"
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Back
          </Button>
        </div>
        <CreateWorkspaceForm />
      </div>
    </div>
  )
}

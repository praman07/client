import { createFileRoute } from '@tanstack/react-router'
import { useOnboardingOrchestrator } from '@/features/onboarding/api/use-onboarding-status'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/_app/onboarding')({
  component: OnboardingPage,
})

function OnboardingPage() {
  const { step, error } = useOnboardingOrchestrator()

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-destructive/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <button 
            className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background">
      <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-500">
        <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="relative rounded-full bg-primary/10 p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        </div>
        
        <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Setting up your workspace
            </h2>
            <p className="text-sm text-muted-foreground min-h-5">
                {step === 'loading' && "Checking account status..."}
                {step === 'syncing' && "Syncing your profile..."}
                {step === 'creating_workspace' && "Creating your first workspace..."}
                {step === 'redirecting' && "Taking you to dashboard..."}
            </p>
        </div>
      </div>
    </div>
  )
}

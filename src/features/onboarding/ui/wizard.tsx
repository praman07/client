import { useState } from 'react'
import { Building2, Loader2 } from 'lucide-react'
import { useCreateOnboardingWorkspace } from '../hooks'
import type { OnboardingStep } from '../model/types'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from '@/shared/ui'

interface OnboardingWizardProps {
  step: OnboardingStep
}

export function OnboardingWizard({ step }: OnboardingWizardProps) {
  const { mutate: createWorkspace, isPending } = useCreateOnboardingWorkspace()
  const [creationError, setCreationError] = useState<string | null>(null)

  const progressValue = {
    loading: 20,
    needs_workspace: 60,
    redirecting: 100,
    error: 100,
  }[step]

  if (step === 'needs_workspace') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create your workspace
            </CardTitle>
            <CardDescription>
              A workspace is where you and your team collaborate on projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {creationError && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive text-center">
                {creationError}
              </p>
            )}
            <Button
              className="w-full"
              disabled={isPending}
              onClick={() => {
                setCreationError(null)
                createWorkspace({}, {
                  onError: () => setCreationError('Failed to create workspace. Please try again.'),
                })
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating workspace…
                </>
              ) : (
                'Create my workspace'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {step === 'redirecting' ? 'All set!' : 'Setting up your account'}
          </CardTitle>
          <CardDescription>
            {step === 'redirecting'
              ? 'Taking you to your workspace…'
              : 'Please wait while we prepare your environment.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center py-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="relative rounded-full bg-primary/10 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={progressValue} className="h-2 w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Setup</span>
              <span className="font-medium animate-pulse">
                {step === 'loading' && 'Checking account…'}
                {step === 'redirecting' && 'Finalizing…'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

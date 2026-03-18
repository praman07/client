import { Loader2 } from 'lucide-react'
import type { OnboardingStep } from '../model/types'
import {
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
  // Deterministic Progress Calculation
  const progressValue =
    {
      loading: 25,
      syncing: 50,
      creating_workspace: 75,
      redirecting: 100,
      error: 100,
    }[step] || 0

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Setting up your workspace
          </CardTitle>
          <CardDescription>
            Please wait while we prepare your environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Indicator */}
          <div className="flex justify-center py-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="relative rounded-full bg-primary/10 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressValue} className="h-2 w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Setup</span>
              <span className="font-medium animate-pulse">
                {step === 'loading' && 'Checking account...'}
                {step === 'syncing' && 'Syncing profile...'}
                {step === 'creating_workspace' && 'Creating workspace...'}
                {step === 'redirecting' && 'Finalizing...'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

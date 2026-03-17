import { OnboardingWizard, useOnboardingOrchestrator } from '@/features/onboarding'
import { RouteError } from '@/shared/ui'

export function OnboardingPage() {
  const { step, error, reset } = useOnboardingOrchestrator()

  if (error) {
    return <RouteError error={error} reset={reset} />
  }

  return <OnboardingWizard step={step} />
}

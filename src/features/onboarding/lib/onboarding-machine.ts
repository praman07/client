import type { OnboardingStatusResponse, OnboardingStep } from '../model/types'

export const deriveOnboardingStep = (
  isLoading: boolean,
  error: unknown,
  status: OnboardingStatusResponse['onboardingStatus'] | undefined,
): OnboardingStep => {
  if (error) return 'error'
  if (isLoading || !status) return 'loading'

  if (!status.hasUser) return 'syncing'
  if (!status.hasWorkspace) return 'creating_workspace'

  return 'redirecting'
}

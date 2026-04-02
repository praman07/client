export interface OnboardingStatusResponse {
  onboardingStatus: {
    hasUser: boolean
    hasWorkspace: boolean
    hasProject: boolean
    workspaceSlug?: string | null
  }
}

/**
 * OnboardingStep — simplified state machine.
 *
 * 'syncing' removed: useSafeUser DB guard ensures user row exists before
 *   any /_app route renders, so the onboarding page never encounters hasUser=false.
 * 'creating_workspace' removed: workspace creation is now an explicit page
 *   action, not an automatic background mutation.
 */
export type OnboardingStep =
  | 'loading'
  | 'needs_workspace'
  | 'redirecting'
  | 'error'

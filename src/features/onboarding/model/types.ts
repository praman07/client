export interface OnboardingStatusResponse {
  onboardingStatus: {
    hasUser: boolean
    hasWorkspace: boolean
    hasProject: boolean
    workspaceSlug?: string | null
  }
}

export type OnboardingStep =
  | 'loading'
  | 'syncing'
  | 'creating_workspace'
  | 'redirecting'
  | 'error'

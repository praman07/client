export type OnboardingStep =
  | 'loading'
  | 'syncing'
  | 'creating_workspace'
  | 'redirecting'
  | 'error'

export interface OnboardingStatusResponse {
  onboardingStatus: {
    hasUser: boolean
    hasWorkspace: boolean
    hasProject: boolean
    workspaceSlug: string | null
  }
}

export interface SyncUserResponse {
  syncUser: {
    id: string
  }
}

export interface CreateWorkspaceResponse {
  createOnboardingWorkspace: {
    id: string
    slug: string
  }
}

import { gql } from '@/gql'

export const SYNC_USER_MUTATION = gql(`
  mutation SyncUser(
    $clerkId: String!
    $email: String!
    $fullName: String
    $avatarUrl: String
  ) {
    syncUser(
      clerkId: $clerkId
      email: $email
      fullName: $fullName
      avatarUrl: $avatarUrl
    ) {
      id
    }
  }
`)

export const CREATE_ONBOARDING_WORKSPACE_MUTATION = gql(`
  mutation CreateOnboardingWorkspace {
    createOnboardingWorkspace {
      id
      slug
    }
  }
`)

export const ONBOARDING_STATUS_QUERY = gql(`
  query OnboardingStatus {
    onboardingStatus {
      hasUser
      hasWorkspace
      hasProject
      workspaceSlug
    }
  }
`)

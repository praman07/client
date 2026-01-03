import { graphql } from '@/shared/api/graphql/generated'

export const ONBOARDING_STATUS_QUERY = graphql(`
  query OnboardingStatus {
    onboardingStatus {
      hasUser
      hasWorkspace
      hasProject
      workspaceSlug
    }
  }
`)

export const SYNC_USER_MUTATION = graphql(`
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

export const CREATE_ONBOARDING_WORKSPACE_MUTATION = graphql(`
  mutation CreateOnboardingWorkspace {
    createOnboardingWorkspace {
      id
      slug
    }
  }
`)

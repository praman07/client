import { ClientError } from 'graphql-request'

export function mapAcceptInviteError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === 'You must be logged in to join.') {
      return error.message
    }
  }

  if (error instanceof ClientError) {
    const gqlError = error.response.errors?.[0]
    const code = gqlError?.extensions.code

    if (
      code === 'WORKSPACE_ONBOARDING_ALREADY_EXISTS' ||
      code === 'ALREADY_WORKSPACE_MEMBER'
    ) {
      return 'You are already a member of this workspace'
    }
  }

  return 'Failed to join workspace. Please try again.'
}

export function isAlreadyMemberError(error: unknown): boolean {
  if (error instanceof ClientError) {
    const gqlError = error.response.errors?.[0]
    const code = gqlError?.extensions.code
    return (
      code === 'WORKSPACE_ONBOARDING_ALREADY_EXISTS' ||
      code === 'ALREADY_WORKSPACE_MEMBER'
    )
  }
  return false
}

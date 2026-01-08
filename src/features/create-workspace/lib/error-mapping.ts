import { ClientError } from 'graphql-request'

export function mapCreateWorkspaceError(error: unknown): string {
  if (error instanceof ClientError) {
    const gqlError = error.response.errors?.[0]
    const code = gqlError?.extensions.code
    const message = gqlError?.message

    switch (code) {
      case 'WORKSPACE_SLUG_RATE_LIMITED':
        return "You're checking availability too fast. Please wait a moment."
      case 'WORKSPACE_SLUG_TAKEN_PERMANENT':
        return 'This URL is permanently taken by another workspace.'
      case 'WORKSPACE_SLUG_TAKEN_RESERVED':
        return 'This URL is reserved for system use.'
      case 'WORKSPACE_SLUG_RESERVATION_FAILED':
        return 'Could not reserve this URL. Please try again.'
      case 'WORKSPACE_CREATION_QUOTA_EXCEEDED':
        return 'You have reached the maximum number of workspaces allowed.'
      case 'WORKSPACE_CREATION_RESERVATION_MISSING':
        return 'Session expired or invalid. Please check availability again.'
      case 'WORKSPACE_CREATION_RESERVATION_STOLEN':
        return 'This URL was claimed by someone else just now.'
      case 'WORKSPACE_CREATION_DB_CONFLICT':
        return 'Workspace with this URL already exists.'
      default:
        if (
          code === 'SLUG_TAKEN' ||
          message?.includes('taken') ||
          (error.message && error.message.includes('taken'))
        ) {
          return 'Slug was taken just now, please try another.'
        }
    }
  }
  return 'Failed to create workspace. Please try again.'
}

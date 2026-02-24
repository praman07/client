import { ClientError } from 'graphql-request'

/**
 * Maps backend AppError codes for lockPage.
 * CONFLICT is the key case: another user holds the Redis lock.
 */
export function mapLockPageError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to lock this page.'
      case 'FORBIDDEN':
        return 'You do not have permission to lock this page.'
      case 'NOT_FOUND':
        return 'Page not found.'
      case 'CONFLICT':
        return 'This page is currently locked by another editor.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }

  if (error instanceof Error) return error.message

  return 'Failed to lock page. Please try again.'
}

/**
 * Maps backend AppError codes for unlockPage.
 * FORBIDDEN has a different message — only owner or workspace ADMIN can unlock.
 */
export function mapUnlockPageError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to unlock this page.'
      case 'FORBIDDEN':
        return 'Only the lock owner or a workspace admin can unlock this page.'
      case 'NOT_FOUND':
        return 'Page not found.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }

  if (error instanceof Error) return error.message

  return 'Failed to unlock page. Please try again.'
}

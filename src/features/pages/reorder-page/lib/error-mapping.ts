import { ClientError } from 'graphql-request'

/**
 * Maps backend AppError codes for reorderPage.
 * CONFLICT means moving a page under one of its own descendants (cycle detected).
 */
export function mapReorderPageError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to move this page.'
      case 'FORBIDDEN':
        return 'You do not have permission to move this page.'
      case 'NOT_FOUND':
        return 'Page not found.'
      case 'CONFLICT':
        return 'Cannot move a page under one of its own child pages.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }

  if (error instanceof Error) return error.message

  return 'Failed to move page. Please try again.'
}

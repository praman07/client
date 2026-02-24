import { ClientError } from 'graphql-request'

/**
 * Maps backend AppError codes to user-friendly messages.
 * CONFLICT is the critical page-specific case: active WS subscribers block deletion.
 */
export function mapDeletePageError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to delete this page.'
      case 'FORBIDDEN':
        return 'You do not have permission to delete this page.'
      case 'NOT_FOUND':
        return 'Page not found or already deleted.'
      case 'CONFLICT':
        return 'This page is being actively edited. Wait for all collaborators to close it before deleting.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }

  if (error instanceof Error) return error.message

  return 'Failed to delete page. Please try again.'
}

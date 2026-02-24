import { ClientError } from 'graphql-request'

/**
 * Maps backend AppError codes to user-friendly messages.
 * Error codes sourced from server create-page/handler.ts and steps.
 */
export function mapCreatePageError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to create a page.'
      case 'FORBIDDEN':
        return 'You do not have permission to create pages in this project.'
      case 'NOT_FOUND':
        return 'Project or workspace not found.'
      case 'PAGE_CREATION_FAILED':
        return 'Failed to create page. Please try again.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }

  if (error instanceof Error) return error.message

  return 'An unexpected error occurred. Please try again.'
}

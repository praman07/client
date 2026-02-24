import { ClientError } from 'graphql-request'

export function mapArchivePageError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to archive this page.'
      case 'FORBIDDEN':
        return 'You do not have permission to archive this page.'
      case 'NOT_FOUND':
        return 'Page not found.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }

  if (error instanceof Error) return error.message

  return 'Failed to archive page. Please try again.'
}

/**
 * CONFLICT is the critical unarchive-specific case:
 * parent page is still archived — must restore parent first.
 */
export function mapUnarchivePageError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to restore this page.'
      case 'FORBIDDEN':
        return 'You do not have permission to restore this page.'
      case 'NOT_FOUND':
        return 'Page not found.'
      case 'CONFLICT':
        return 'Cannot restore this page — its parent is still archived. Restore the parent first.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }

  if (error instanceof Error) return error.message

  return 'Failed to restore page. Please try again.'
}

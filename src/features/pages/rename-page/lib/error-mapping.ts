import { ClientError } from 'graphql-request'

export function mapRenamePageError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to rename this page.'
      case 'FORBIDDEN':
        return 'You do not have permission to rename this page.'
      case 'NOT_FOUND':
        return 'Page not found.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }

  if (error instanceof Error) return error.message

  return 'Failed to rename page. Please try again.'
}

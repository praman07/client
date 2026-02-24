import { ClientError } from 'graphql-request'

export function mapGetPageError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code
    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to view this page.'
      case 'FORBIDDEN':
        return 'You do not have access to this page.'
      case 'NOT_FOUND':
        return 'Page not found.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }
  if (error instanceof Error) return error.message
  return 'Failed to load page. Please try again.'
}

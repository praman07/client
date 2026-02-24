import { ClientError } from 'graphql-request'

/**
 * Maps backend AppError codes for addPageCollaborators.
 * NOT_FOUND can mean the page is missing OR one of the target userIds doesn't exist.
 */
export function mapAddPageCollaboratorsError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to add collaborators.'
      case 'FORBIDDEN':
        return 'You do not have permission to add collaborators to this page.'
      case 'NOT_FOUND':
        return 'One or more users were not found.'
      default:
        return (
          error.response.errors?.[0]?.message ?? 'An unexpected error occurred.'
        )
    }
  }

  if (error instanceof Error) return error.message

  return 'Failed to add collaborators. Please try again.'
}

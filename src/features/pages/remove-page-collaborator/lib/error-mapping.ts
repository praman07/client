import { ClientError } from 'graphql-request'

/**
 * Maps backend AppError codes for removePageCollaborator.
 * FORBIDDEN has two causes: not EDITOR, OR trying to remove the page creator.
 * The message differentiates the creator case specifically.
 */
export function mapRemovePageCollaboratorError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code
    const message = error.response.errors?.[0]?.message ?? ''

    switch (code) {
      case 'UNAUTHORIZED':
        return 'You must be logged in to remove collaborators.'
      case 'FORBIDDEN':
        // Distinguish creator guard from general EDITOR gate
        if (message.toLowerCase().includes('creator')) {
          return 'Cannot remove the page creator from collaborators.'
        }
        return 'You do not have permission to remove collaborators from this page.'
      case 'NOT_FOUND':
        return 'Page not found.'
      default:
        return message || 'An unexpected error occurred.'
    }
  }

  if (error instanceof Error) return error.message

  return 'Failed to remove collaborator. Please try again.'
}

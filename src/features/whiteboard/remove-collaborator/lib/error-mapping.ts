export function mapRemoveCollaboratorError(error: unknown): string {
  if (!error) return 'Failed to remove collaborator'

  const message = (error as Error).message || ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to remove collaborators'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to remove this collaborator'
  }

  if (message.includes('NOT_FOUND')) {
    return 'Collaborator not found'
  }

  if (message.includes('CONFLICT')) {
    return 'Cannot remove the board creator'
  }

  return 'Failed to remove collaborator. Please try again.'
}

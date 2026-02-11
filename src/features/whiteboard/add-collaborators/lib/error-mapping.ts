export function mapAddCollaboratorsError(error: unknown): string {
  if (!error) return 'Failed to add collaborators'

  const message = (error as Error).message || ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to add collaborators'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to add collaborators to this board'
  }

  if (message.includes('NOT_FOUND')) {
    return 'Board not found'
  }

  if (message.includes('VALIDATION_ERROR')) {
    return 'Please check your selection and try again'
  }

  return 'Failed to add collaborators. Please try again.'
}

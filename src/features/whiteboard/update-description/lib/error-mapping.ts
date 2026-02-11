/**
 * Maps backend errors to user-friendly messages for description updates
 */
export function mapUpdateDescriptionError(error: any): string {
  if (!error) return 'Failed to update description'

  const message = error.message || ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to update this board'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to edit this board'
  }

  if (message.includes('NOT_FOUND')) {
    return 'Board not found'
  }

  if (message.includes('VALIDATION_ERROR')) {
    return 'Description is too long (max 500 characters)'
  }

  return 'Failed to update description. Please try again.'
}

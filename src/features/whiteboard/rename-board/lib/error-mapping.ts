/**
 * Maps backend errors to user-friendly messages for board renaming
 *
 * Architecture: Centralizes error handling for consistent UX
 */
export function mapRenameBoardError(error: any): string {
  if (!error) return 'Failed to rename board'

  const message = error.message || ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to rename this board'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to rename this board'
  }

  if (message.includes('NOT_FOUND')) {
    return 'Board not found'
  }

  if (message.includes('CONFLICT')) {
    return 'A board with this title already exists'
  }

  if (message.includes('VALIDATION_ERROR')) {
    return 'Please check your input and try again'
  }

  return 'Failed to rename board. Please try again.'
}

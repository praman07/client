/**
 * Maps backend errors to user-friendly messages for board creation
 */
export function mapCreateBoardError(error: any): string {
  if (!error) return 'Failed to create board'

  const message = error.message || ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to create a board'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to create boards in this workspace'
  }

  if (message.includes('CONFLICT')) {
    return 'A board with this title already exists'
  }

  if (message.includes('VALIDATION_ERROR')) {
    return 'Please check your input and try again'
  }

  return 'Failed to create board. Please try again.'
}

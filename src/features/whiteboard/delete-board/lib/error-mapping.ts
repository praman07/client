/**
 * Maps backend errors to user-friendly messages for board deletion
 *
 * Architecture: Centralizes error handling for consistent UX across delete operations
 */
export function mapDeleteBoardError(error: any): string {
  if (!error) return 'Failed to delete board'

  const message = error.message || ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to delete this board'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to delete this board'
  }

  if (message.includes('NOT_FOUND')) {
    return 'Board not found or already deleted'
  }

  return 'Failed to delete board. Please try again.'
}

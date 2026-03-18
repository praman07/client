/**
 * Maps backend GQL errors to user-friendly messages for folder creation.
 *
 * Architecture: Centralized error handling keeps form logic clean.
 * @layer Features
 */
export function mapCreateFolderError(error: unknown): string {
  if (!error) return 'Failed to create folder'

  const message = (error as { message?: string }).message ?? ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to create a folder'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to create a folder here'
  }

  if (message.includes('CONFLICT')) {
    return 'A folder with this name already exists'
  }

  if (message.includes('NOT_FOUND')) {
    return 'The parent folder no longer exists'
  }

  return 'Failed to create folder. Please try again.'
}

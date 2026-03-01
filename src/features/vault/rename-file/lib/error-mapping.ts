/**
 * Maps backend GQL errors to user-friendly messages for file renaming.
 *
 * @layer Features
 */
export function mapRenameFileError(error: unknown): string {
  if (!error) return 'Failed to rename file'

  const message = (error as { message?: string }).message ?? ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to rename a file'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to rename this file'
  }

  if (message.includes('CONFLICT')) {
    return 'A file with this name already exists in this folder'
  }

  if (message.includes('NOT_FOUND')) {
    return 'File not found — it may have been deleted'
  }

  return 'Failed to rename file. Please try again.'
}

/**
 * Maps backend GQL errors to user-friendly messages for folder renaming.
 *
 * @layer Features
 */
export function mapRenameFolderError(error: unknown): string {
  if (!error) return 'Failed to rename folder'

  const message = (error as { message?: string }).message ?? ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to rename a folder'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to rename this folder'
  }

  if (message.includes('CONFLICT')) {
    return 'A folder with this name already exists here'
  }

  if (message.includes('NOT_FOUND')) {
    return 'Folder not found — it may have been deleted'
  }

  return 'Failed to rename folder. Please try again.'
}

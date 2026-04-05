/**
 * Maps backend errors to user-friendly messages for Workspace General Settings
 */
export function mapUpdateWorkspaceError(error: any): string {
  if (!error) return 'Failed to update workspace'

  const message = error.message || ''

  if (message.includes('UNAUTHORIZED')) {
    return 'You must be logged in to update the workspace'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to update this workspace'
  }

  if (message.includes('NOT_FOUND')) {
    return 'Workspace not found'
  }

  return 'Failed to update workspace. Please try again.'
}

export function mapRenameSlugError(error: any): string {
  if (!error) return 'Failed to rename workspace slug'

  const message = error.message || ''

  if (message.includes('RESERVATION_STOLEN')) {
    return 'This slug was taken by someone else or your reservation expired. Please try again.'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to rename this workspace slug'
  }

  if (message.includes('CONFLICT')) {
    return 'This slug is already in use'
  }

  return 'Failed to rename workspace slug. Please try again.'
}

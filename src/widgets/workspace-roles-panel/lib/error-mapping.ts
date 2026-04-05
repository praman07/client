/**
 * Maps backend errors to user-friendly messages for Workspace Role & Permission settings
 */
export function mapRolePermissionError(error: any): string {
  if (!error) return 'Failed to update role permissions'

  const message = error.message || ''

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to manage roles in this workspace'
  }

  if (message.includes('NOT_FOUND')) {
    return 'Role or permission not found'
  }

  return 'Failed to update role permissions. Please try again.'
}

export function mapCreateRoleError(error: any): string {
  if (!error) return 'Failed to create workspace role'

  const message = error.message || ''

  if (message.includes('CONFLICT')) {
    return 'A role with this name already exists in this workspace'
  }

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to create roles in this workspace'
  }

  return 'Failed to create role. Please try again.'
}

export function mapUpdateWorkspaceRoleError(error: any): string {
  if (!error) return 'Failed to update workspace role'

  const message = error.message || ''

  if (message.includes('FORBIDDEN')) {
    return 'You do not have permission to update roles'
  }

  return 'Failed to update role. Please try again.'
}

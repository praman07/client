import { toast } from 'sonner'
import { ClientError } from 'graphql-request'

function mapError(error: unknown): string {
  if (error instanceof ClientError) {
    const message = error.response.errors?.[0]?.message
    if (message) return message
  }
  if (error instanceof Error) return error.message
  return 'Please try again.'
}

export function handleAddProjectMemberError(error: unknown) {
  toast.error('Failed to add member', { description: mapError(error) })
}

export function handleRemoveProjectMemberError(error: unknown) {
  toast.error('Failed to remove member', { description: mapError(error) })
}

export function handleUpdateProjectMemberRoleError(error: unknown) {
  toast.error('Failed to update member role', { description: mapError(error) })
}

export function handleLeaveProjectError(error: unknown) {
  toast.error('Failed to leave project', { description: mapError(error) })
}

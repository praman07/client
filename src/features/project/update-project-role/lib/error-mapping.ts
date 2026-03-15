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

export function handleUpdateProjectRoleError(error: unknown) {
  toast.error('Failed to update role', { description: mapError(error) })
}

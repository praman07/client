import { toast } from 'sonner'
import { ClientError } from 'graphql-request'

function mapError(error: unknown): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code
    if (code === 'UNAUTHORIZED')
      return 'You do not have permission to delete this project.'
    const message = error.response.errors?.[0]?.message
    if (message) return message
  }
  if (error instanceof Error) return error.message
  return 'Please try again.'
}

export function handleDeleteProjectError(error: unknown) {
  toast.error('Failed to delete project', { description: mapError(error) })
}

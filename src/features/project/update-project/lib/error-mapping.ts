import { toast } from 'sonner'
import { ClientError } from 'graphql-request'

function mapError(error: unknown, fallback: string): string {
  if (error instanceof ClientError) {
    const code = error.response.errors?.[0]?.extensions?.code
    const message = error.response.errors?.[0]?.message
    if (code === 'UNAUTHORIZED')
      return 'You do not have permission to perform this action.'
    if (message) return message
  }
  if (error instanceof Error) return error.message
  return fallback
}

export function handleUpdateProjectError(error: unknown) {
  toast.error('Failed to update project', {
    description: mapError(error, 'Please try again.'),
  })
}

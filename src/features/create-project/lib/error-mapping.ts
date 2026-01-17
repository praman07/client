import { toast } from 'sonner'
import { ClientError } from 'graphql-request'
// import type { CreateProjectFormApi } from '../model/types'

/*
 * Pure helper to map backend error codes to user-friendly messages
 */
export function mapCreateProjectError(error: unknown): string {
  if (error instanceof ClientError) {
    const gqlError = error.response.errors?.[0]
    const code = gqlError?.extensions.code

    switch (code) {
      // Slug / Reservation Errors
      case 'PROJECT_SLUG_RATE_LIMITED':
        return "You're checking availability too fast. Please wait a moment."
      case 'PROJECT_SLUG_TAKEN_PERMANENT':
        return 'This URL is already taken by another project.'
      case 'PROJECT_SLUG_TAKEN_RESERVED':
        return 'This URL is reserved for system use.'

      // Creation Errors
      case 'PROJECT_CREATION_QUOTA_EXCEEDED':
        return 'You have reached the maximum number of projects allowed in this workspace.'
      case 'PROJECT_CREATION_MISSING_PERMISSION':
        return 'You do not have permission to create projects in this workspace.'
      case 'PROJECT_CREATION_FAILED':
        return 'Failed to create project. Please try again.'

      default:
        // Graceful fallback for generic/unknown codes
        return gqlError?.message || 'An unexpected error occurred.'
    }
  }

  // Network or unexpected JS errors
  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}

/**
 * Maps GraphQL/Server errors to Form Fields or Global Toasts
 * Uses the inferred form type for strict safety.
 */
export function handleCreateProjectError(error: Error) {
  const message = mapCreateProjectError(error)

  toast.error('Project creation failed', {
    description: message,
  })
}

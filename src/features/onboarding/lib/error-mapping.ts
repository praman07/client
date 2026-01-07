import { ClientError } from 'graphql-request'

/**
 * Maps raw backend/GraphQL errors to user-friendly UI messages.
 */
export function mapOnboardingError(error: unknown): Error {
  // Default fallback
  let message = 'An unexpected error occurred. Please try again.'

  if (error instanceof ClientError) {
    const graphqlErrors = error.response.errors
    if (graphqlErrors && graphqlErrors.length > 0) {
      const firstError = graphqlErrors[0]
      const code = firstError.extensions.code
      const msg = firstError.message

      // Specific Error Codes from Backend
      switch (code) {
        case 'IDEMPOTENCY_LOCKED':
          message =
            'We are already processing your request. Please wait a moment.'
          break
        case 'WORKSPACE_ONBOARDING_CUSTOM_SLUG_TAKEN':
          message =
            'That workspace URL is already taken. Please choose another.'
          break
        case 'WORKSPACE_ONBOARDING_SLUG_GENERATION_FAILED':
          message =
            'We could not generate a unique URL for you. Please try again.'
          break
        default:
          // If no specific code, use the backend message if meaningful
          if (msg) message = msg
      }
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return new Error(message)
}

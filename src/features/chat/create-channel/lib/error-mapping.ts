import {
  CHANNEL_NAME_INVALID,
  CHANNEL_NAME_RESERVATION_STOLEN,
  CHANNEL_NAME_TAKEN,
  NETWORK_ERROR,
  PROJECT_ACCESS_DENIED,
  RATE_LIMIT_EXCEEDED,
  VALIDATION_ERROR,
  WORKSPACE_ACCESS_DENIED,
} from './constants'

export interface ErrorResponse {
  title: string
  description: string
  code: string
  retryable?: boolean
  field?: string
}

interface GqlErrorShape {
  extensions?: { code?: string }
  code?: string
  message?: string
}

export function getChannelErrorMessage(error: unknown): ErrorResponse {
  // Handle GraphQL errors
  if (error && typeof error === 'object' && 'graphQLErrors' in error) {
    const gqlError = error as { graphQLErrors?: Array<GqlErrorShape> }
    if (gqlError.graphQLErrors && gqlError.graphQLErrors.length > 0) {
      const firstError = gqlError.graphQLErrors[0]
      return mapGraphQLError(firstError)
    }
  }

  // Handle network errors
  if (error && typeof error === 'object' && 'networkError' in error) {
    return {
      title: 'Connection Error',
      description:
        'Unable to connect to the server. Please check your internet connection.',
      code: NETWORK_ERROR,
      retryable: true,
    }
  }

  // Handle generic errors
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred'

  return {
    title: 'Something went wrong',
    description: message,
    code: 'UNKNOWN_ERROR',
  }
}

function mapGraphQLError(error: GqlErrorShape): ErrorResponse {
  const code = error.extensions?.code ?? error.code
  const message = error.message ?? ''

  switch (code) {
    case 'CHANNEL_NAME_TAKEN':
    case 'CHANNEL_NAME_TAKEN_PERMANENT':
    case 'P2002': // Prisma unique constraint
      return {
        title: 'Channel name taken',
        description: 'A channel with this name already exists in the project.',
        code: CHANNEL_NAME_TAKEN,
        field: 'name',
      }

    case 'CHANNEL_NAME_RESERVATION_STOLEN':
      return {
        title: 'Name reservation expired',
        description:
          'Someone else claimed this channel name. Please choose a different name.',
        code: CHANNEL_NAME_RESERVATION_STOLEN,
        field: 'name',
      }

    case 'CHANNEL_NAME_INVALID':
      return {
        title: 'Invalid channel name',
        description:
          'Channel names must be lowercase, contain only letters, numbers, and hyphens.',
        code: CHANNEL_NAME_INVALID,
        field: 'name',
      }

    case 'WORKSPACE_ACCESS_DENIED':
    case 'FORBIDDEN':
      return {
        title: 'Access denied',
        description:
          'You do not have permission to create channels in this workspace.',
        code: WORKSPACE_ACCESS_DENIED,
      }

    case 'PROJECT_ACCESS_DENIED':
      return {
        title: 'Project access denied',
        description: 'You do not have access to this project.',
        code: PROJECT_ACCESS_DENIED,
      }

    case 'RATE_LIMIT_EXCEEDED':
      return {
        title: 'Too many attempts',
        description: 'Please wait a moment before trying again.',
        code: RATE_LIMIT_EXCEEDED,
        retryable: true,
      }

    case 'VALIDATION_ERROR':
      return {
        title: 'Validation error',
        description: message || 'Please check your input and try again.',
        code: VALIDATION_ERROR,
      }

    case 'UNAUTHORIZED':
      return {
        title: 'Authentication required',
        description: 'Please log in to continue.',
        code: 'UNAUTHORIZED',
      }

    default:
      // Try to extract field-specific errors from message
      if (message.includes('Channel name')) {
        return {
          title: 'Invalid channel name',
          description: message,
          code: CHANNEL_NAME_INVALID,
          field: 'name',
        }
      }

      return {
        title: 'Error',
        description: message || 'An unexpected error occurred.',
        code: 'UNKNOWN_ERROR',
      }
  }
}

// Legacy function for backward compatibility
export function getCreateChannelErrorMessage(error: unknown): string {
  const response = getChannelErrorMessage(error)
  return response.description
}

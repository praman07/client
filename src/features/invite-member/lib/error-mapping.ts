import { ClientError } from 'graphql-request'

export function mapInviteMemberError(error: unknown): string {
  if (error instanceof ClientError) {
    const gqlError = error.response.errors?.[0]
    const code = gqlError?.extensions.code

    switch (code) {
      case 'INVITE_LIMIT_EXCEEDED':
        return 'You cannot invite more than 5 members at once.'
      // Never show email/notification provider errors to users
      // These indicate invite was created but email delivery failed
      // The invite still exists and can be resent later
      case 'NOTIFICATION_PROVIDER_ERROR':
        return '' // Suppress error — show generic success
    }
  }

  return 'Failed to invite members. Please try again.'
}

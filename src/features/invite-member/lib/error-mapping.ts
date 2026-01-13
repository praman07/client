import { ClientError } from 'graphql-request'

export function mapInviteMemberError(error: unknown): string {
  if (error instanceof ClientError) {
    const gqlError = error.response.errors?.[0]
    const code = gqlError?.extensions.code

    switch (code) {
      case 'INVITE_LIMIT_EXCEEDED':
        return 'You cannot invite more than 5 members at once.'
    }
  }

  return 'Failed to invite members. Please try again.'
}

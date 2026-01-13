import { ClientError } from 'graphql-request'

export function mapMembersError(error: unknown): string {
  if (error instanceof ClientError) {
    const errorCode = error.response.errors?.[0]?.extensions?.code

    if (errorCode === 'FORBIDDEN') {
      return 'You do not have permission to view members.'
    }
  }

  return 'Failed to load members.'
}

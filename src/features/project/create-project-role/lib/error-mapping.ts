import { ClientError } from 'graphql-request'

export function mapCreateProjectRoleError(error: unknown): string {
  if (error instanceof ClientError) {
    const message = error.response.errors?.[0]?.message
    if (message) return message
  }
  if (error instanceof Error) return error.message
  return 'Failed to create role'
}
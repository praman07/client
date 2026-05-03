import { GraphQLClient } from 'graphql-request'
import { env } from '@/shared/config/env'

/**
 * Creates a configured GraphQL client instance.
 *
 * @param token - Optional Clerk session token
 * @returns GraphQLClient instance with auth headers
 */
export const GqlClient = (token?: string | null) => {
  const endpoint = `${env.VITE_SERVER_URL}/graphql`

  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return new GraphQLClient(endpoint, {
    headers,
  })
}

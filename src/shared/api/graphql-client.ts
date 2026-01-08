import { GraphQLClient } from 'graphql-request'
import { env } from '@/shared/config/env'

/**
 * Creates a configured GraphQL client instance.
 *
 * @param token - Optional Clerk session token
 * @returns GraphQLClient instance with auth headers
 */
export const createGqlClient = (token?: string | null) => {
  const baseUrl =
    env.VITE_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  const endpoint = `${baseUrl}/graphql`

  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return new GraphQLClient(endpoint, {
    headers,
  })
}

import { request } from 'graphql-request'
import { env } from '@/shared/config/env'

/**
 * Helper for making authenticated GraphQL requests.
 *
 * @param document The GraphQL document (query/mutation)
 * @param token The Clerk session token
 * @param variables Optional variables for the operation
 * @returns The result of the GraphQL operation
 */
export async function authenticatedGraphQLRequest<T>(
  document: any,
  token: string | null | undefined,
  variables?: any,
) {
  if (!token) {
    throw new Error('No session token provided for authenticated request')
  }

  // Use environment variable from strict env config, fallback to window origin
  const baseUrl =
    env.VITE_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  const endpoint = `${baseUrl}/graphql`

  return request<T>(endpoint, document, variables, {
    Authorization: `Bearer ${token}`,
  })
}

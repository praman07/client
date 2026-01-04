import { request } from 'graphql-request'
import type { RequestDocument, Variables } from 'graphql-request'
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
  document: RequestDocument,
  token: string | null | undefined,
  variables?: Variables,
) {
  if (!token) {
    const error = new Error(
      'No session token provided for authenticated request',
    )
    ;(error as any).code = 'UNAUTHENTICATED'
    throw error
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

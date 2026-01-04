import { GraphQLClient } from 'graphql-request'
import { env } from '@/shared/config/env'

const endpoint = env.VITE_SERVER_URL || 'http://localhost:3000/graphql'

export const graphQLClient = new GraphQLClient(endpoint, {
  headers: () => {
    // TODO: Add auth token
    return {}
  },
})

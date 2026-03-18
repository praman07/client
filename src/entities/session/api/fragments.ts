import { gql } from '@/gql'
import { USER_FRAGMENT } from '@/entities/user'

export { USER_FRAGMENT }

export const SYNC_USER_MUTATION = gql(`
  mutation SessionSyncUser(
    $clerkId: String!
    $email: String!
    $fullName: String
    $avatarUrl: String
  ) {
    syncUser(
      clerkId: $clerkId
      email: $email
      fullName: $fullName
      avatarUrl: $avatarUrl
    ) {
      id
      email
      fullName
      avatarUrl
    }
  }`)

export const GET_ME_QUERY = gql(`
  query GetMe {
    me {
      ...User
    }
  }
`)

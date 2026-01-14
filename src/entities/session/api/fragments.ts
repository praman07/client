import { gql } from '@/gql'

export const SESSION_USER_FRAGMENT = gql(`
  fragment SessionUser on User {
    id
    email
    fullName
    avatarUrl
  }
`)

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
      ...SessionUser
    }
  }
`)

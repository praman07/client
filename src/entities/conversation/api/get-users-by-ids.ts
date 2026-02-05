import { gql } from '@/gql'

export const GET_USERS_BY_IDS = gql(`
  query GetUsersByIds($userIds: [ID!]!) {
    getUsersByIds(userIds: $userIds) {
      id
      fullName
      email
      avatarUrl
    }
  }
`)

import { gql } from '@/gql'

export const USER_FRAGMENT = gql(`
  fragment UserFragment on User {
    id
    email
    fullName
    avatarUrl
  }
`)

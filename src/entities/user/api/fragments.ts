import { gql } from '@/gql'

export const USER_FRAGMENT = gql(`
  fragment User on User {
    id
    email
    fullName
    avatarUrl
  }
`)

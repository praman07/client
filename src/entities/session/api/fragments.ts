import { gql } from '@/gql'

export const SESSION_USER_FRAGMENT = gql(`
  fragment SessionUser on User {
    id
    email
    fullName
    avatarUrl
  }
`)

export const SESSION_WORKSPACE_FRAGMENT = gql(`
  fragment SessionWorkspace on Workspace {
    id
    slug
    name
    logoUrl
    domainWhitelist
  }
`)

import { graphql } from '@/shared/api/graphql/generated'

export const SESSION_USER_FRAGMENT = graphql(`
  fragment SessionUser on User {
    id
    email
    fullName
    avatarUrl
  }
`)

export const SESSION_WORKSPACE_FRAGMENT = graphql(`
  fragment SessionWorkspace on Workspace {
    id
    slug
    name
    logoUrl
    domainWhitelist
  }
`)

import { gql } from '@/gql'

export const WORKSPACE_FRAGMENT = gql(`
  fragment WorkspaceFragment on Workspace {
    id
    name
    slug
    logoUrl
  }
`)

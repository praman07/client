import { graphql } from '@/shared/api/graphql/generated'

export const GET_ME_QUERY = graphql(`
  query GetMe {
    me {
      ...SessionUser
    }
  }
`)

export const GET_WORKSPACE_BY_SLUG_QUERY = graphql(`
  query GetWorkspaceBySlug($slug: String!) {
    workspaceBySlug(slug: $slug) {
      ...SessionWorkspace
    }
  }
`)

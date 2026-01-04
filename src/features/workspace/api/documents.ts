import { graphql } from '@/shared/api/graphql/generated'

export const GET_MY_WORKSPACES_QUERY = graphql(`
  query GetMyWorkspaces {
    myWorkspaces {
      id
      slug
      name
      logoUrl
    }
  }
`)

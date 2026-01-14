import { gql } from '@/gql'

export const GET_MY_WORKSPACES_QUERY = gql(`
  query GetMyWorkspaces {
    myWorkspaces {
      id
      slug
      name
      logoUrl
    }
  }
`)

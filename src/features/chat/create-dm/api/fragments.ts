import { gql } from '@/gql'

export const CREATE_DM_MUTATION = gql(`
  mutation CreateDm($input: CreateDmInput!) {
    createDm(input: $input) {
      id
      type
      workspaceId
      projectId
    }
  }
`)

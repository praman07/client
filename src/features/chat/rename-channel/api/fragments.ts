import { gql } from '@/gql'

export const RENAME_CHANNEL_MUTATION = gql(`
  mutation RenameChannel($input: RenameChannelInput!) {
    renameChannel(input: $input) {
      id
      name
      type
      workspaceId
      projectId
      updatedAt
    }
  }
`)

import { gql } from '@/gql'

export const ARCHIVE_CHANNEL_MUTATION = gql(`
  mutation ArchiveChannel($input: ArchiveChannelInput!) {
    archiveChannel(input: $input) {
      id
      name
      type
      isArchived
      deletedAt
      workspaceId
      projectId
      updatedAt
    }
  }
`)

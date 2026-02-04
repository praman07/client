import { gql } from '@/gql'

export const UNARCHIVE_CHANNEL_MUTATION = gql(`
  mutation UnarchiveChannel($workspaceId: ID!, $channelId: ID!) {
    unarchiveChannel(workspaceId: $workspaceId, channelId: $channelId) {
      success
      channelId
      name
    }
  }
`)

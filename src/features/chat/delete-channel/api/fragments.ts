import { gql } from '@/gql'

export const DELETE_CHANNEL_MUTATION = gql(`
  mutation DeleteChannel($workspaceId: ID!, $channelId: ID!) {
    deleteChannel(workspaceId: $workspaceId, channelId: $channelId) {
      success
      channelId
    }
  }
`)

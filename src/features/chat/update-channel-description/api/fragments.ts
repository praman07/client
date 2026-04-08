import { gql } from '@/gql'

export const UPDATE_CHANNEL_DESCRIPTION_MUTATION = gql(`
  mutation UpdateChannelDescription($workspaceId: ID!, $channelId: ID!, $description: String) {
    updateChannelDescription(workspaceId: $workspaceId, channelId: $channelId, description: $description) {
      success
      channelId
      description
    }
  }
`)

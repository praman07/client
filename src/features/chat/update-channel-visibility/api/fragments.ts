import { gql } from '@/gql'

export const UPDATE_CHANNEL_VISIBILITY_MUTATION = gql(`
  mutation UpdateChannelVisibility($workspaceId: ID!, $channelId: ID!, $isPublic: Boolean!) {
    updateChannelVisibility(workspaceId: $workspaceId, channelId: $channelId, isPublic: $isPublic) {
      success
      channelId
      isPublic
    }
  }
`)

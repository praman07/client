import { gql } from '@/gql'

export const ADD_CHANNEL_MEMBERS_MUTATION = gql(`
  mutation AddChannelMembers($workspaceId: ID!, $channelId: ID!, $userIds: [ID!]!) {
    addChannelMembers(workspaceId: $workspaceId, channelId: $channelId, userIds: $userIds) {
      success
      addedCount
      skippedCount
      members {
        userId
        user {
          id
          fullName
          email
          avatarUrl
        }
      }
    }
  }
`)

export const REMOVE_CHANNEL_MEMBER_MUTATION = gql(`
  mutation RemoveChannelMember($workspaceId: ID!, $channelId: ID!, $userId: ID!) {
    removeChannelMember(workspaceId: $workspaceId, channelId: $channelId, userId: $userId) {
      success
      channelId
      userId
    }
  }
`)

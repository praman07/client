import { gql } from '@/gql'

export const CHANNEL_FIELDS_FRAGMENT = gql(`
  fragment ChannelFields on Conversation {
    id
    name
    topic
    type
    projectId
    memberCount
    createdAt
    updatedAt
    isArchived
    workspaceId
  }
`)

export const GET_CHANNELS = gql(`
  query GetUserChannels($workspaceId: ID!, $projectId: ID!) {
    getUserChannels(workspaceId: $workspaceId, projectId: $projectId) {
      ...ChannelFields
    }
  }
`)

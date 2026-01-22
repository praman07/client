import { gql } from '@/gql'

export const CREATE_CHANNEL = gql(`
  mutation CreateChannel($input: CreateChannelInput!) {
    createChannel(input: $input) {
      workspaceId
      ...ChannelFields
    }
  }
`)

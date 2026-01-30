import { gql } from '@/gql'

export const CHECK_CHANNEL_AVAILABILITY_MUTATION = gql(`
  mutation CheckChannelAvailability($input: CheckChannelAvailabilityInput!) {
    checkChannelAvailability(input: $input) {
      available
      message
      reason
      reservationId
    }
  }
`)

export const CREATE_CHANNEL_MUTATION = gql(`
  mutation CreateChannel($input: CreateChannelInput!) {
    createChannel(input: $input) {
      id
      name
      type
      workspaceId
      projectId
    }
  }
`)

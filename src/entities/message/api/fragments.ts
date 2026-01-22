import { gql } from '@/gql'

export const MESSAGE_FIELDS_FRAGMENT = gql(`
  fragment MessageFields on ChatMessage {
    id
    channelId
    content
    authorUserId
    type
    createdAt
  }
`)

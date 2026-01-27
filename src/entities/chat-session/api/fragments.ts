import { gql } from '@/gql'

export const MESSAGE_RECOVERY_FRAGMENT = gql(`
  fragment MessageRecoveryFields on ChatMessage {
    id
    streamId
    conversationId
    authorUserId
    content
    type
    createdAt
  }
`)

export const GET_MISSING_MESSAGES = gql(`
  query GetMissingMessages($conversationId: ID!, $afterStreamId: String!, $limit: Int) {
    messagesDelta(conversationId: $conversationId, afterStreamId: $afterStreamId, limit: $limit) {
      ...MessageRecoveryFields
    }
  }
`)

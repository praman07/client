import { gql } from '@/gql'

export const MESSAGE_RECOVERY_FRAGMENT = gql(`
  fragment MessageRecoveryFields on ChatMessage {
    id
    streamId
    sequence
    conversationId
    authorUserId
    content
    type
    createdAt
  }
`)

export const GET_MISSING_MESSAGES = gql(`
  query GetMissingMessages($conversationId: ID!, $afterSequence: Int!, $limit: Int) {
    messagesDelta(conversationId: $conversationId, afterSequence: $afterSequence, limit: $limit) {
      messages {
        ...MessageRecoveryFields
      }
      hasMore
      lastSequence
    }
  }
`)

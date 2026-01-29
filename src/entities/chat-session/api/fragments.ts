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

export const GET_HISTORY = gql(`
  query GetHistory($conversationId: ID!, $beforeSequence: Int!, $limit: Int) {
    history(conversationId: $conversationId, beforeSequence: $beforeSequence, limit: $limit) {
       messages {
         ...MessageRecoveryFields
       }
       hasMore
       minSequence
    }
  }
`)

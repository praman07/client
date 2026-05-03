import { gql } from '@/gql'

export const CREATE_MENTIONS = gql(`
  mutation CreateMentions($mentions: [CreateMentionInput!]!) {
    createMentions(mentions: $mentions) {
      id
      sourceEntityId
      sourceEntityType
      targetEntityId
      targetEntityType
      displayText
      sourceLocation
      tier
      status
      createdAt
      createdById
    }
  }
`)

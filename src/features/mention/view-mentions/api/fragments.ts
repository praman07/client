import { gql } from '@/gql'

export const GET_MENTIONS = gql(`
  query GetMentions($sourceEntityId: ID!) {
    getMentions(sourceEntityId: $sourceEntityId) {
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

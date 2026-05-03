import { gql } from '@/gql'

export const DELETE_MENTIONS_BY_SOURCE = gql(`
  mutation DeleteMentionsBySource($sourceEntityId: ID!) {
    deleteMentionsBySource(sourceEntityId: $sourceEntityId)
  }
`)

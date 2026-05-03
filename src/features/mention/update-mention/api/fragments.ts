import { gql } from '@/gql'

export const UPDATE_MENTION = gql(`
  mutation UpdateMention($input: UpdateMentionInput!) {
    updateMention(input: $input) {
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

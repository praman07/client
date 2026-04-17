import { gql } from '@/gql'

export const GET_MENTION_EVENTS = gql(`
  query GetMentionEvents($mentionId: ID!) {
    getMentionEvents(mentionId: $mentionId) {
      id
      mentionId
      eventType
      payload
      actorId
      createdAt
    }
  }
`)

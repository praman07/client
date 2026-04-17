import { gql } from '@/gql'

export const MENTION_FIELDS = gql(`
  fragment MentionFields on Mention {
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
`)

export const BACKLINK_FIELDS = gql(`
  fragment BacklinkFields on Backlink {
    id
    sourceEntityId
    sourceEntityType
    targetEntityId
    targetEntityType
    context
    createdAt
    sourceMention {
      ...MentionFields
    }
  }
`)

export const BACKLINK_RESULT_FIELDS = gql(`
  fragment BacklinkResultFields on BacklinkResult {
    backlinks {
      ...BacklinkFields
    }
    total
    hasMore
  }
`)

export const MENTION_EVENT_FIELDS = gql(`
  fragment MentionEventFields on MentionEvent {
    id
    mentionId
    eventType
    payload
    actorId
    createdAt
  }
`)

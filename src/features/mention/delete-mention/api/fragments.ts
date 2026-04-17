import { gql } from '@/gql'

export const DELETE_MENTIONS = gql(`
  mutation DeleteMentions($mentionIds: [ID!]!) {
    deleteMentions(mentionIds: $mentionIds)
  }
`)

import { gql } from '@/gql'

export const ORPHAN_MENTIONS = gql(`
  mutation OrphanMentions($targetEntityId: ID!) {
    orphanMentions(targetEntityId: $targetEntityId)
  }
`)

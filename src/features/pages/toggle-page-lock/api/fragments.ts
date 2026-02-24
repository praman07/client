import { gql } from '@/gql'

export const LOCK_PAGE = gql(`
  mutation LockPage($input: LockPageInput!) {
    lockPage(input: $input) {
      page {
        id
        isLocked
        updatedAt
      }
    }
  }
`)

export const UNLOCK_PAGE = gql(`
  mutation UnlockPage($input: UnlockPageInput!) {
    unlockPage(input: $input) {
      page {
        id
        isLocked
        updatedAt
      }
    }
  }
`)

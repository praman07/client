import { gql } from '@/gql'

export const GET_BOARD_SNAPSHOT = gql(`
  query GetBoardSnapshot($boardId: ID!, $clientSnapshot: String) {
    getBoardSnapshot(boardId: $boardId, clientSnapshot: $clientSnapshot) {
      boardId
      snapshot
      lastStreamId
      snapshotTimestamp
    }
  }
`)

import { gql } from '@/gql'

export const GET_BOARD_SNAPSHOT = gql(`
  query GetBoardSnapshot($boardId: ID!, $stateVector: String) {
    getBoardSnapshot(boardId: $boardId, stateVector: $stateVector) {
      boardId
      snapshot
      lastStreamId
      snapshotTimestamp
    }
  }
`)

import { gql } from '@/gql'

export const GET_BOARD_SNAPSHOT = gql(`
  query GetBoardSnapshot($boardId: ID!) {
    boardSnapshot(boardId: $boardId) {
      boardId
      snapshot
      lastStreamId
      snapshotTimestamp
    }
  }
`)

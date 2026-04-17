import { gql } from '@/gql'

export const GET_PROJECT_ENTITIES = gql(`
  query GetProjectEntities($projectId: ID!) {
    getProjectEntities(projectId: $projectId) {
      id
      type
      name
    }
  }
`)

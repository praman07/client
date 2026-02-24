import { gql } from '@/gql'
import '@/entities/page/api/fragments'

export const GET_PROJECT_PAGES = gql(`
  query GetProjectPages($projectId: ID!) {
    getProjectPages(projectId: $projectId) {
      ...PageWithChildren
    }
  }
`)

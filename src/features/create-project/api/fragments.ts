import { gql } from '@/gql'

export const CREATE_PROJECT = gql(`
  mutation CreateProject($workspaceId: ID!, $input: CreateProjectInput!) {
    createProject(workspaceId: $workspaceId, input: $input) {
      ...ProjectFields
    }
  }
`)

export const CHECK_SLUG = gql(`
  mutation CheckSlug($workspaceId: ID!, $slug: String!) {
    checkProjectSlugAvailability(workspaceId: $workspaceId, slug: $slug) {
      available
      message
      reason
      reservationId
    }
  }
`)

export { PROJECT_FRAGMENT } from '@/entities/project/api/fragments'

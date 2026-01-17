import { gql } from '@/gql'

export const PROJECT_FRAGMENT = gql(`
  fragment ProjectFields on Project {
    id
    key
    name
    description
    workspaceId
    createdAt
    updatedAt
    members {
      userId
      role
      joinedAt
    }
  }
`)

export const GET_PROJECT = gql(`
  query GetProject($id: ID!) {
    project(id: $id) {
      ...ProjectFields
    }
  }
`)

export const LIST_PROJECTS_BY_USER = gql(`
  query MyProjects($workspaceId: ID!) {
    myProjects(workspaceId: $workspaceId) {
      ...ProjectFields
    }
  }
`)

export const GET_PROJECT_BY_SLUG = gql(`
  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {
    projectBySlug(workspaceId: $workspaceId, slug: $slug) {
      ...ProjectFields
    }
  }
`)

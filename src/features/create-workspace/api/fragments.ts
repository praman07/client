import { gql } from '@/gql'

export const CREATE_WORKSPACE = gql(`
  mutation CreateWorkspace($slug: String!, $name: String!) {
    createWorkspace(slug: $slug, name: $name) {
      id
      slug
      name
    }
  }
`)

export const CHECK_SLUG_AVAILABILITY = gql(`
  mutation CheckSlugAvailability($slug: String!) {
    checkSlugAvailability(slug: $slug) {
      available
      message
    }
  }
`)

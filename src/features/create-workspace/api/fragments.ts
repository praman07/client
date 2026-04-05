import { gql } from '@/gql'
export { CHECK_SLUG_AVAILABILITY_MUTATION as CHECK_SLUG_AVAILABILITY } from '@/entities/workspace'

export const CREATE_WORKSPACE = gql(`
  mutation CreateWorkspace($slug: String!, $name: String!) {
    createWorkspace(slug: $slug, name: $name) {
      id
      slug
      name
    }
  }
`)

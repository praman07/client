import { gql } from '@/gql'

export const UPDATE_PROFILE_MUTATION = gql(`
  mutation UpdateProfileMutation($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...User
    }
  }
`)

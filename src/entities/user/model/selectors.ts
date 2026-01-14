import type { UserFragment } from '@/gql/graphql'

interface UserStateShape {
  user: {
    currentUser: UserFragment | null
  }
}

export const selectCurrentUser = (state: UserStateShape) =>
  state.user.currentUser

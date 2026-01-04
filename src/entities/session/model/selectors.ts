import type { RootState } from '@/app/store'

// Basic Selectors
export const selectCurrentUser = (state: RootState) => state.session.currentUser
export const selectCurrentWorkspace = (state: RootState) =>
  state.session.currentWorkspace
export const selectSessionLoading = (state: RootState) =>
  state.session.isLoading
export const selectIsAuthenticated = (state: RootState) =>
  !!state.session.currentUser

// Derived Selectors
export const selectUserDisplayName = (state: RootState) => {
  const user = selectCurrentUser(state)
  if (!user) return ''
  return user.fullName || user.email || 'User'
}

export const selectUserAvatarInitial = (state: RootState) => {
  const name = selectUserDisplayName(state)
  return name.charAt(0).toUpperCase()
}

export const selectIsWorkspaceLoaded =
  (slug?: string) => (state: RootState) => {
    const workspace = selectCurrentWorkspace(state)
    if (!workspace || !slug) return false
    return workspace.slug === slug
  }

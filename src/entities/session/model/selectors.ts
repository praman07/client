// Structural typing for selectors to avoid circular dependency on RootState
interface SessionStateShape {
  session: {
    token: string | null
    isAuthenticated: boolean
  }
}

export const selectIsAuthenticated = (state: SessionStateShape) =>
  state.session.isAuthenticated
export const selectSessionToken = (state: SessionStateShape) =>
  state.session.token

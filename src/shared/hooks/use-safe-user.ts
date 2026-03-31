import { useAuth as useClerkAuth } from '@clerk/clerk-react'

/**
 * useSafeUser — safe wrapper around Clerk's useUser.
 *
 * Returns a stable shape regardless of auth loading state.
 * Use this instead of Clerk's useUser directly so we don't
 * scatter nullability handling across the app.
 */
export function useSafeUser() {
  const { isLoaded, isSignedIn, userId, sessionId } = useClerkAuth()

  return {
    isLoaded,
    isAuthenticated: isLoaded && !!isSignedIn,
    userId: userId ?? null,
    sessionId: sessionId ?? null,
  }
}

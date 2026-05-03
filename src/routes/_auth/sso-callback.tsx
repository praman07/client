import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sso-callback')({
  component: SSOCallbackPage,
})

/**
 * SSOCallbackPage — processes OAuth redirect from Clerk.
 *
 * AuthenticateWithRedirectCallback is a headless processor (not visual UI).
 * It reads the URL params from the OAuth provider redirect and completes
 * the Clerk session handshake. The redirectUrlComplete set in authenticateWithRedirect
 * determines where the user lands after (e.g. /home or /onboarding).
 */
function SSOCallbackPage() {
  return <AuthenticateWithRedirectCallback />
}

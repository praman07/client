import { useClerk } from '@clerk/clerk-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { PageSpinner } from '@/shared/ui/skeletons/page-spinner'

export const Route = createFileRoute('/_auth/sso-callback')({
  component: SSOCallbackPage,
})

/**
 * SSOCallbackPage — processes OAuth redirect from Clerk.
 *
 * Uses handleRedirectCallback manually instead of AuthenticateWithRedirectCallback
 * to catch incomplete states (like missing_requirements) and redirect the user safely
 * rather than hanging infinitely on a loading spinner.
 */
function SSOCallbackPage() {
  const clerk = useClerk()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    async function processSSO() {
      try {
        await clerk.handleRedirectCallback({
          signInForceRedirectUrl: '/home',
          signUpForceRedirectUrl: '/home',
        })

        if (!mounted) return

        // If handleRedirectCallback finishes but we are still on this page,
        // it means we got stuck in an incomplete state.
        const signInStatus = clerk.client.signIn.status
        const signUpStatus = clerk.client.signUp.status

        if (signUpStatus === 'missing_requirements') {
          // Typically happens if account linking is off and the email is already in use.
          navigate({ to: '/sign-up' })
        } else if (
          signInStatus === 'needs_identifier' || 
          signInStatus === 'needs_first_factor'
        ) {
          // Stalled in sign-in flow (e.g. bad state)
          navigate({ to: '/sign-in' })
        } else if (signInStatus === 'complete' || signUpStatus === 'complete') {
          // Flow succeeded, redirecting to home
          navigate({ to: '/home' })
        }
      } catch (err) {
        console.error('SSO Callback Error:', err)
        if (mounted) navigate({ to: '/sign-in' })
      }
    }

    void processSSO()

    return () => {
      mounted = false
    }
  }, [clerk, navigate])

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center">
      <PageSpinner label="Authenticating with Google..." />
    </div>
  )
}

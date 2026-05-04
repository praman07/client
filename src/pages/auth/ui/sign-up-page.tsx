import { useClerk } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'
import { AuthSplitLayout } from './auth-layout'

export function SignUpPage() {
  const { loaded: isLoaded } = useClerk()
  const clerk = useClerk()
  const [error, setError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleSSO = async () => {
    if (!isLoaded || !clerk.loaded) return
    setIsGoogleLoading(true)
    setError(null)
    try {
      await clerk.client.signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/home',
      })
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ code: string; message: string }> }
      if (clerkError.errors?.[0]?.code === 'strategy_for_user_invalid') {
        try {
          // Clear any stale ticket/client_trust_state that restricts the strategies for this browser
          await clerk.signOut()
          await clerk.client.signIn.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: '/sso-callback',
            redirectUrlComplete: '/home',
          })
          return
        } catch (fallbackErr: unknown) {
          const fallbackClerkErr = fallbackErr as { errors?: Array<{ message: string }> }
          setError(fallbackClerkErr.errors?.[0]?.message ?? 'OAuth failed. Please try again.')
        }
      } else {
        setError(clerkError.errors?.[0]?.message ?? 'OAuth failed. Please try again.')
      }
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthSplitLayout>
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-primary/10 mb-2">
            <span className="text-accent-primary text-20 font-bold">C</span>
          </span>
          <h1 className="text-24 font-semibold tracking-tight text-primary">
            Create an account
          </h1>
          <p className="text-14 text-secondary">
            Start collaborating with your team today
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-danger-strong bg-danger-subtle px-3 py-2 text-13 text-danger-primary text-center">
            {error}
          </p>
        )}

        <div className="space-y-6">
          {/* Google SSO Button */}
          <Button
            type="button"
            onClick={handleGoogleSSO}
            className="w-full h-11 gap-3 bg-accent-primary text-on-color hover:bg-accent-primary-hover shadow-sm transition-all border-none"
            disabled={isGoogleLoading || !isLoaded}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-on-color" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
              </svg>
            )}
            <span className="text-14 font-medium text-primary">Continue with Google</span>
          </Button>
        </div>

        <p className="text-center text-13 text-secondary pt-2">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-medium text-accent-primary hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  )
}

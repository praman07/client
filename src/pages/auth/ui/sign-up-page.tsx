import { useSignUp } from '@clerk/clerk-react'
import { useState } from 'react'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/primitives/input-otp'
import { Label } from '@/shared/ui/primitives/label'
import { Separator } from '@/shared/ui/primitives/separator'

type Step = 'credentials' | 'verify'

export function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [step, setStep] = useState<Step>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setError(null)
    setIsSubmitting(true)
    try {
      await signUp.create({ emailAddress: email, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setStep('verify')
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> }
      setError(clerkError.errors?.[0]?.message ?? 'Sign up failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await signUp.attemptEmailAddressVerification({ code })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        window.location.replace('/onboarding')
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> }
      setError(clerkError.errors?.[0]?.message ?? 'Invalid code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSSO = (strategy: 'oauth_google' | 'oauth_github') => {
    if (!isLoaded) return
    void signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/onboarding',
    })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-surface-1 p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/logo2.png" alt="Collabify" className="h-10 w-10 rounded-xl object-contain" />
          <h1 className="text-20 font-semibold tracking-tight text-primary">
            {step === 'credentials' ? 'Create your account' : 'Check your email'}
          </h1>
          <p className="text-13 text-secondary">
            {step === 'credentials'
              ? 'Start collaborating with your team'
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {step === 'credentials' ? (
          <>
            {/* SSO Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" onClick={() => handleSSO('oauth_google')} className="w-full gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button" onClick={() => handleSSO('oauth_github')} className="w-full gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                GitHub
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-layer-transparent px-2 text-11 text-secondary">
                or continue with email
              </span>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <p className="rounded-lg border border-danger-strong bg-danger-subtle px-3 py-2 text-13 text-danger-primary">
                  {error}
                </p>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || !isLoaded}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          </>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
<p className="rounded-lg border border-danger-strong bg-danger-subtle px-3 py-2 text-13 text-danger-primary">
                  {error}
                </p>
            )}
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || code.length < 6}>
              {isSubmitting ? 'Verifying…' : 'Verify email'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-secondary"
              onClick={() => { setStep('credentials'); setError(null) }}
            >
              ← Back
            </Button>
          </form>
        )}

        {step === 'credentials' && (
          <p className="text-center text-13 text-secondary">
            Already have an account?{' '}
            <a href="/sign-in" className="font-medium text-primary underline underline-offset-4 hover:text-accent-primary">
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

import { SignUp } from '@clerk/clerk-react'

interface SignUpPageProps {
  redirectUrl?: string | null
}

export function SignUpPage({ redirectUrl }: SignUpPageProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignUp
          signInUrl="/sign-in"
          forceRedirectUrl={redirectUrl || '/onboarding'}
        />
      </div>
    </div>
  )
}

import { SignIn } from '@clerk/clerk-react'

interface SignInPageProps {
  redirectUrl?: string | null
}

export function SignInPage({ redirectUrl }: SignInPageProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignIn
          signUpUrl="/sign-up"
          forceRedirectUrl={redirectUrl || '/onboarding'}
        />
      </div>
    </div>
  )
}

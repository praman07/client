import { SignIn } from '@clerk/clerk-react'

interface Props {
  redirectUrl?: string | null
}

export function SignInWidget({ redirectUrl }: Props) {
  return (
    <SignIn
      signUpUrl="/sign-up"
      forceRedirectUrl={redirectUrl || '/onboarding'}
    />
  )
}

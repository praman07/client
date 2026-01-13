import { SignUp } from '@clerk/clerk-react'

interface Props {
  redirectUrl?: string | null
}

export function SignUpWidget({ redirectUrl }: Props) {
  return (
    <SignUp
      signInUrl="/sign-in"
      forceRedirectUrl={redirectUrl || '/onboarding'}
    />
  )
}

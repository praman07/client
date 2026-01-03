import { SignIn } from '@clerk/clerk-react'

export function SignInWidget() {
  return (
    <SignIn 
      signUpUrl="/sign-up"
      forceRedirectUrl="/onboarding"
    />
  )
}

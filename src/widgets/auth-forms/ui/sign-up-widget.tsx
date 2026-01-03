import { SignUp } from '@clerk/clerk-react'

export function SignUpWidget() {
  return (
    <SignUp
      signInUrl="/sign-in"
    />
  )
}

import { SignUpWidget } from '@/widgets/auth-forms/sign-up-widget'

interface Props {
  redirectUrl?: string
}

export function AuthSignupPage({ redirectUrl }: Props) {
  return (
    <>
      <title>Sign Up - Collabify</title>
      <meta name="description" content="Sign up for a Collabify account" />
      <SignUpWidget redirectUrl={redirectUrl} />
    </>
  )
}

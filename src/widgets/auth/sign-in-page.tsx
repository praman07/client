import { SignInWidget } from '@/widgets/auth-forms/sign-in-widget'

interface Props {
  redirectUrl?: string
}

export function AuthSigninPage({ redirectUrl }: Props) {
  return (
    <>
      <title>Sign In - Collabify</title>
      <meta name="description" content="Sign in to your Collabify account" />
      <SignInWidget redirectUrl={redirectUrl} />
    </>
  )
}

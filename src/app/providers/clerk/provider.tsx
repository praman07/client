import { ClerkProvider } from '@clerk/clerk-react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/app/store'

import { env } from '@/shared/config/env'

const PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY

export default function AppClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </ClerkProvider>
  )
}

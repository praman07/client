import { Outlet, createFileRoute } from '@tanstack/react-router'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { useSyncCurrentUser } from '@/entities/session/lib/use-session-sync'
import { ReduxProvider } from '@/app/providers/redux/provider'

export const Route = createFileRoute('/_app')({
  component: AppLayoutWrapper,
})

function AppLayoutWrapper() {
  return (
    <ReduxProvider>
      <AppLayout />
    </ReduxProvider>
  )
}

function AppLayout() {
  useSyncCurrentUser()

  return (
    <>
      <SignedIn>
        <Outlet />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

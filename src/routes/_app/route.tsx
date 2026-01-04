import { Outlet, createFileRoute } from '@tanstack/react-router'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { RouteError } from '@/shared/ui/error/route-error'
import { useSyncCurrentUser } from '@/entities/session/lib/use-session-sync'
import { ReduxProvider } from '@/app/providers/redux/provider'

export const Route = createFileRoute('/_app')({
  component: AppLayoutWrapper,
  errorComponent: RouteError,
  beforeLoad: async () => {
    // This is where the beforeLoad logic would go.
    // The original AppLayoutWrapper content might be moved here or elsewhere
    // depending on the full context of the change.
    // For now, we'll leave it as an empty async function body as per the snippet.
  },
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

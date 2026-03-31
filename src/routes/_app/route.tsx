import { Outlet, createFileRoute } from '@tanstack/react-router'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { RouteError } from '@/shared/ui'
import { useSyncCurrentUser } from '@/entities/user'
import { useAuthSync } from '@/entities/session'
import { ReduxProvider } from '@/app/providers/redux/provider'
import { AuthorizationProvider } from '@/shared/lib/auth'

export const Route = createFileRoute('/_app')({
  component: AppLayoutWrapper,
  errorComponent: RouteError,
})

function AppLayoutWrapper() {
  return (
    <ReduxProvider>
      <AppLayout />
    </ReduxProvider>
  )
}

function AppLayout() {
  useAuthSync()
  useSyncCurrentUser()

  return (
    <>
      <SignedIn>
        <AuthorizationProvider>
          <Outlet />
        </AuthorizationProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

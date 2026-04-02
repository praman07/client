import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { RouteError } from '@/shared/ui'
import { useAuthSync } from '@/entities/session'
import { ReduxProvider } from '@/app/providers/redux/provider'
import { AuthorizationProvider } from '@/shared/lib/auth'
import { useSafeUser } from '@/shared/hooks'

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
  const navigate = useNavigate()
  const { isLoaded, isAuthenticated, isDbUserReady, isSyncing } = useSafeUser()

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      void navigate({ to: '/sign-in', replace: true })
    }
  }, [isLoaded, isAuthenticated, navigate])

  // Clerk still initializing
  if (!isLoaded) return null

  // Not signed in — redirect is in-flight
  if (!isAuthenticated) return null

  // Signed in but DB row not ready yet (sync in-flight or first fetch)
  if (!isDbUserReady || isSyncing) return null

  return (
    <AuthorizationProvider>
      <Outlet />
    </AuthorizationProvider>
  )
}

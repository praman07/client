import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AuthSplitLayout } from '@/shared/ui/layouts/auth-split-layout'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <AuthSplitLayout>
      <Outlet />
    </AuthSplitLayout>
  )
}

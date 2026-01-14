import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AuthSplitLayout } from '@/pages/auth'

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

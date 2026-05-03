import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { UserProfilePage } from '@/pages/user-settings'

export const Route = createFileRoute('/_app/_user-layer/user/profile')({
  component: () => (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-screen-2xl w-full px-(--padding-page) py-6 md:py-8">
        <UserProfilePage />
      </div>
    </main>
  ),
  errorComponent: RouteError,
})

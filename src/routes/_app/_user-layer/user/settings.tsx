import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { UserSettingsPage } from '@/pages/user-settings'

export const Route = createFileRoute('/_app/_user-layer/user/settings')({
  component: () => (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-screen-2xl w-full px-(--padding-page) py-6 md:py-8">
        <UserSettingsPage />
      </div>
    </main>
  ),
  errorComponent: RouteError,
})

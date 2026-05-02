import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { HomePage } from '@/pages/home'

export const Route = createFileRoute('/_app/_user-layer/home')({
  component: () => (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-screen-2xl w-full px-(--padding-page) py-6 md:py-8">
        <HomePage />
      </div>
    </main>
  ),
  errorComponent: RouteError,
})

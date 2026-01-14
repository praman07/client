import { Outlet, createFileRoute } from '@tanstack/react-router'
import { MarketingNavbar } from '@/pages/marketing/ui/components'

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayout,
})

function MarketingLayout() {
  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

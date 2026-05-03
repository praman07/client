import { useRouterState } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { UserDropdown } from './user-dropdown'
import { ThemeToggle } from './theme-toggle'
import type { RouteStaticData } from '../model'
import { Button } from '@/shared/ui'

// Define the known shape of staticData for breadcrumbs

export function DashboardHeader({ children }: { children?: React.ReactNode }) {
  const matches = useRouterState({ select: (s) => s.matches })

  const breadcrumbs = matches
    .filter(
      (match) => (match.staticData as unknown as RouteStaticData).breadcrumb,
    )
    .map((match) => ({
      id: match.id,
      component: (match.staticData as unknown as RouteStaticData).breadcrumb!,
    }))

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] w-full border-b border-subtle bg-surface-1">
      <div className="flex h-14 items-center gap-4 px-[var(--padding-page)]">
        <div className="flex items-center gap-4 mr-auto">
          <div className="flex items-center gap-2 text-13">
            {breadcrumbs.map((crumb, index) => {
              const Component = crumb.component
              return (
                <Fragment key={crumb.id}>
                  {index > 0 && (
                    <span className="text-tertiary font-light">/</span>
                  )}
                  <Component />
                </Fragment>
              )
            })}
          </div>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserDropdown />
        </div>
      </div>
      {children}
    </header>
  )
}

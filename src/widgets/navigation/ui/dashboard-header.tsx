import { useRouterState } from '@tanstack/react-router'
import { UserButton } from '@clerk/clerk-react'
import { Bell } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import type { RouteStaticData } from '../model'
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/shared/ui'

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-6">
        {/* Left: Logo & Context */}
        <div className="flex items-center gap-4 mr-auto">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src="/logo2.png"
              alt="Collabify"
              className="rounded-lg object-contain"
            />
            <AvatarFallback className="rounded-lg">C</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => {
              const Component = crumb.component
              return (
                <Fragment key={crumb.id}>
                  {index > 0 && (
                    <span className="text-muted-foreground/40">/</span>
                  )}
                  <Component />
                </Fragment>
              )
            })}
          </div>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
            <UserButton
              afterSignOutUrl="/sign-in"
              userProfileUrl="/user-settings"
              userProfileMode="navigation"
            />
          </div>
        </div>
      </div>
      {children}
    </header>
  )
}

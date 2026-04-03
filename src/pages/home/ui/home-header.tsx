import { useNavigate } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/shared/ui/primitives/button'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { SidebarTrigger } from '@/shared/ui/primitives/sidebar'

export interface HomeHeaderProps {
  firstName: string
  isLoading: boolean
}

export function HomeHeader({ firstName, isLoading }: HomeHeaderProps) {
  const navigate = useNavigate()

  // Dynamic time-based greeting logic
  const hour = new Date().getHours()
  let greeting = 'Good evening'
  if (hour < 12) greeting = 'Good morning'
  else if (hour < 18) greeting = 'Good afternoon'

  return (
    <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="flex items-start gap-3">
        <SidebarTrigger className="-ml-3 mt-1 hidden md:flex" />
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading ? <Skeleton className="h-9 w-48 inline-block" /> : `${greeting}, ${firstName}`}
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base max-w-lg">
            Here's what's happening across your workspaces today.
          </p>
        </div>
      </div>
      <div className="flex items-center shrink-0">
        <Button onClick={() => void navigate({ to: '/workspace/new' })} className="gap-2 shadow-sm">
          <HugeiconsIcon icon={Add01Icon} className="size-4" />
          Create Workspace
        </Button>
      </div>
    </section>
  )
}

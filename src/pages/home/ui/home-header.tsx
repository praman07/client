import { useNavigate } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/shared/ui/primitives/button'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

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
    <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2 px-[var(--padding-page)] pt-8">
      <div className="flex items-start gap-3">
        <div className="flex flex-col">
          <h1 className="text-24 font-semibold tracking-tight text-primary">
            {isLoading ? <Skeleton className="h-9 w-48 inline-block animate-pulse-subtle" /> : `${greeting}, ${firstName}`}
          </h1>
          <p className="text-secondary mt-1.5 text-13 sm:text-14 max-w-lg">
            Here's what's happening across your workspaces today.
          </p>
        </div>
      </div>
      <div className="flex items-center shrink-0">
        <Button onClick={() => void navigate({ to: '/workspace/new' })} className="gap-2 shadow-raised-100">
          <HugeiconsIcon icon={Add01Icon} className="size-4" />
          Create Workspace
        </Button>
      </div>
    </section>
  )
}

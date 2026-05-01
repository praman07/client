import { useMemo } from 'react'
import { buildPageTree } from '../hooks/use-page-tree'
import { PageTreeSection } from './page-tree-section'
import { ScrollArea } from '@/shared/ui'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { Sidebar, SidebarContent } from '@/shared/ui/primitives/sidebar'
import { useProjectPages } from '@/features/pages/fetch-project-pages'
import { CreatePageModal } from '@/features/pages/create-page'

interface PageSidebarProps {
  projectId: string
}

/**
 * Pages sidebar — shows the project's page tree with create/archive/delete actions.
 *
 * Mount inside a <SidebarProvider> in the pages route layout.
 * <CreatePageModal /> is rendered here so it overlays correctly.
 *
 * @layer Widgets
 */
export function PageSidebar({ projectId }: PageSidebarProps) {
  const { data, isLoading } = useProjectPages(projectId)

  const tree = useMemo(() => {
    const pages = (data ?? [])
    return buildPageTree(pages)
  }, [data])

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-subtle inset-y-0 z-0 relative h-full"
    >
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-1 px-1 py-2 animate-fade-in-in">
            {isLoading ? (
              <PageTreeSkeleton />
            ) : (
              <PageTreeSection pages={tree} />
            )}
          </div>
        </ScrollArea>
      </SidebarContent>
      {/* Modal rendered inside Sidebar so it overlays within the sidebar shell */}
      <CreatePageModal />
    </Sidebar>
  )
}

function PageTreeSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-2 py-2">
      <div className="flex items-center justify-between px-2 py-1.5">
        <Skeleton className="h-4 w-12 animate-pulse-subtle" />
        <Skeleton className="h-4 w-4 animate-pulse-subtle" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-4 w-4 animate-pulse-subtle" />
          <Skeleton className="h-4 w-32 animate-pulse-subtle" />
        </div>
      ))}
    </div>
  )
}

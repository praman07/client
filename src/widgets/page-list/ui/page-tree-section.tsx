import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/ui/primitives/sidebar'
import { useCreatePageModal } from '@/features/pages/create-page'
import type { PageTreeNode } from '../lib/types'
import { PageTreeItem } from './page-tree-item'

interface PageTreeSectionProps {
  pages: PageTreeNode[]
}

/**
 * Sidebar group displaying the project's page tree.
 *
 * "+" action in the label opens the create-page modal for a root page.
 * Each root page renders as a collapsible PageTreeItem.
 *
 * @layer Widgets
 */
export function PageTreeSection({ pages }: PageTreeSectionProps) {
  const { open } = useCreatePageModal()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarGroupAction
        title="New Page"
        onClick={() => open({ parentId: null })}
      >
        <HugeiconsIcon icon={PlusSignIcon} />
        <span className="sr-only">New Page</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {pages.map((node) => (
            <PageTreeItem key={node.page.id} node={node} />
          ))}
          {pages.length === 0 && (
            <p className="px-2 py-4 text-xs text-muted-foreground text-center">
              No pages yet.{' '}
              <button
                className="underline underline-offset-2"
                onClick={() => open({ parentId: null })}
              >
                Create one
              </button>
            </p>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

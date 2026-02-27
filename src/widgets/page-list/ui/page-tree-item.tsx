import { useState } from 'react'
import { Link, useMatch, useParams } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ChevronRight,
  File01Icon,
} from '@hugeicons/core-free-icons'
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/shared/ui/primitives/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/primitives/collapsible'
import type { PageTreeNode } from '../lib/types'
import { PageTreeItemActions } from './page-tree-item-actions'

interface PageTreeItemProps {
  node: PageTreeNode
  depth?: number
}

/**
 * Recursive sidebar item for a single page.
 *
 * @layer Widgets
 */
export function PageTreeItem({ node, depth = 0 }: PageTreeItemProps) {
  const { workspaceSlug, projectSlug } = useParams({ strict: false }) as {
    workspaceSlug: string
    projectSlug: string
  }
  // Use useMatch to safely detect active page — avoids accessing $pageId param
  // outside its route scope (sidebar renders at the layout level above $pageId)
  const matchedPage = useMatch({
    from: '/_app/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId',
    shouldThrow: false,
  })
  const activePageId = matchedPage?.params?.pageId ?? null
  const [open, setOpen] = useState(false)
  const hasChildren = node.children.length > 0
  const isActive = activePageId === node.page.id

  const icon = node.page.icon ? (
    <span className="text-sm">{node.page.icon}</span>
  ) : (
    <HugeiconsIcon icon={File01Icon} />
  )

  return (
    <SidebarMenuItem>
      {hasChildren ? (
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="relative flex items-center">
            <SidebarMenuButton
              isActive={isActive}
              tooltip={node.page.title || 'Untitled'}
              render={
                <Link
                  to="/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId"
                  params={{ workspaceSlug, projectSlug, pageId: node.page.id }}
                />
              }
            >
              {icon}
              <span className="truncate">{node.page.title || 'Untitled'}</span>
            </SidebarMenuButton>
            <CollapsibleTrigger
              className="absolute right-6 flex h-4 w-4 items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <HugeiconsIcon
                icon={ChevronRight}
                className={`h-3 w-3 transition-transform ${open ? 'rotate-90' : ''}`}
              />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <SidebarMenuSub>
              {node.children.map((child) => (
                <SidebarMenuSubItem key={child.page.id}>
                  <PageTreeItem node={child} depth={depth + 1} />
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <SidebarMenuButton
          isActive={isActive}
          tooltip={node.page.title || 'Untitled'}
          render={
            <Link
              to="/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId"
              params={{ workspaceSlug, projectSlug, pageId: node.page.id }}
            />
          }
        >
          {icon}
          <span className="truncate">{node.page.title || 'Untitled'}</span>
        </SidebarMenuButton>
      )}
      <PageTreeItemActions
        pageId={node.page.id}
        pageTitle={node.page.title || 'Untitled'}
      />
    </SidebarMenuItem>
  )
}

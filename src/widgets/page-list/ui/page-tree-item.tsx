import { useState } from 'react'
import { Link, useMatch, useParams } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronRight, File01Icon } from '@hugeicons/core-free-icons'
import {
  SidebarMenuItem,
  SidebarMenuButton,
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

/** Returns true if any descendant of `node` has the given id. */
function hasActiveDescendant(
  node: PageTreeNode,
  activeId: string | null,
): boolean {
  if (!activeId) return false
  return node.children.some(
    (c) => c.page.id === activeId || hasActiveDescendant(c, activeId),
  )
}

/**
 * Recursive sidebar item for a single page.
 *
 * Supports unlimited nesting depth via a depth-scaled paddingLeft indent
 * (replacing SidebarMenuSub which clips at level 3+).
 *
 * Auto-expands when a descendant is the active page.
 *
 * @layer Widgets
 */
export function PageTreeItem({ node, depth = 0 }: PageTreeItemProps) {
  const { workspaceSlug, projectSlug } = useParams({ strict: false }) as {
    workspaceSlug: string
    projectSlug: string
  }
  const matchedPage = useMatch({
    from: '/_app/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId',
    shouldThrow: false,
  })
  const activePageId = matchedPage?.params?.pageId ?? null
  const hasChildren = node.children.length > 0
  const isActive = activePageId === node.page.id

  // Auto-expand if the active page is a descendant of this node
  const [open, setOpen] = useState(() =>
    hasActiveDescendant(node, activePageId),
  )

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
            {/* Depth-scaled indent — works for unlimited nesting levels */}
            <div style={{ paddingLeft: `${(depth + 1) * 12}px` }}>
              {node.children.map((child) => (
                <PageTreeItem
                  key={child.page.id}
                  node={child}
                  depth={depth + 1}
                />
              ))}
            </div>
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

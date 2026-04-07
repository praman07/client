import React from 'react'
import { FileText, ChevronRight } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'

interface PagePreview {
  id: string
  title: string
  emojiIcon?: string | null
  updatedAt: string
  createdByName?: string | null
}

interface RecentPagesProps {
  pages: PagePreview[]
}

const PageIcon: React.FC<{ emoji?: string | null }> = ({ emoji }) => {
  if (emoji) {
    return (
      <div className="h-8 w-8 shrink-0 rounded-lg bg-muted/50 flex items-center justify-center text-base">
        {emoji}
      </div>
    )
  }
  return (
    <div className="h-8 w-8 shrink-0 rounded-lg bg-muted/50 flex items-center justify-center">
      <FileText className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}

export const RecentPages: React.FC<RecentPagesProps> = ({ pages }) => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  return (
    <div className="h-full bg-card border border-border rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Pages</h3>
        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/pages"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
          className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <p className="text-[11px] text-muted-foreground">No pages created yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {pages.map((page) => (
            <Link
              key={page.id}
              to="/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId"
              params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '', pageId: page.id }}
              className="flex items-center gap-3 py-1.5 rounded-lg hover:bg-muted/40 transition-colors group -mx-1 px-1"
            >
              <PageIcon emoji={page.emojiIcon} />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground/90 truncate group-hover:text-foreground transition-colors">
                  {page.title || 'Untitled Page'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Edited {formatDistanceToNow(new Date(page.updatedAt))} ago
                  {page.createdByName ? ` by ${page.createdByName}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

import React from 'react'
import { ChevronRight, FileText } from 'lucide-react'
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
  pages: Array<PagePreview>
}

const PageIcon: React.FC<{ emoji?: string | null }> = ({ emoji }) => {
  if (emoji) {
    return (
      <div className="h-8 w-8 shrink-0 rounded-lg bg-layer-2 flex items-center justify-center text-base">
        {emoji}
      </div>
    )
  }
  return (
    <div className="h-8 w-8 shrink-0 rounded-lg bg-layer-2 flex items-center justify-center">
      <FileText className="h-4 w-4 text-secondary" />
    </div>
  )
}

export const RecentPages: React.FC<RecentPagesProps> = ({ pages }) => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  return (
    <div className="h-full bg-layer-1 border border-subtle rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-14 font-semibold text-primary">Recent Pages</h3>
        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/pages"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
          className="text-11 text-secondary hover:text-primary transition-colors flex items-center gap-0.5"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-subtle rounded-lg">
          <p className="text-11 text-secondary">No pages created yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {pages.map((page) => (
            <Link
              key={page.id}
              to="/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId"
              params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '', pageId: page.id }}
              className="flex items-center gap-3 py-1.5 rounded-lg hover:bg-layer-2-hover transition-colors group -mx-1 px-1"
            >
              <PageIcon emoji={page.emojiIcon} />
              <div className="min-w-0">
                <p className="text-13 font-medium text-primary truncate group-hover:text-primary transition-colors">
                  {page.title || 'Untitled Page'}
                </p>
                <p className="text-11 text-secondary truncate">
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

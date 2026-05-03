import React from 'react'
import { ChevronRight, History, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Link, useParams } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'

interface Issue {
  id: string
  number: number
  title: string
  priority: string
  statusName: string
  statusColor: string
  assigneeName?: string | null
  assigneeAvatar?: string | null
  updatedAt: string
}

interface RecentIssuesProps {
  issues: Array<Issue>
}

export const RecentIssues: React.FC<RecentIssuesProps> = ({ issues }) => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  return (
    <div className="h-full bg-layer-1 border border-subtle rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-14 font-semibold text-primary">Recent Issues</h3>
        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/issues"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
          search={{ issueId: undefined }}
          className="text-11 text-secondary hover:text-accent-primary transition-colors flex items-center gap-0.5"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {issues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-subtle rounded-lg gap-2">
          <History className="h-6 w-6 text-disabled" />
          <p className="text-11 text-secondary">No recent issues</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-layer-transparent-hover transition-colors group cursor-default"
            >
              {/* Status dot */}
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: issue.statusColor }}
              />

              {/* Number + title */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-10 font-mono text-secondary shrink-0">
                    #{issue.number}
                  </span>
                  <p className="text-12 font-medium text-primary truncate group-hover:text-primary transition-colors">
                    {issue.title}
                  </p>
                </div>
                <p className="text-10 text-secondary">
                  Updated {formatDistanceToNow(new Date(issue.updatedAt))} ago
                </p>
              </div>

              {/* Assignee avatar */}
              <Avatar className="h-5 w-5 shrink-0 border border-subtle">
                <AvatarImage src={issue.assigneeAvatar || ''} />
                <AvatarFallback className="bg-layer-2 text-8 font-bold">
                  {issue.assigneeName
                    ? issue.assigneeName.charAt(0).toUpperCase()
                    : <User className="h-3 w-3" />}
                </AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

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
    <div className="h-full bg-card border border-border rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Issues</h3>
        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/kanban"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
          className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {issues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg gap-2">
          <History className="h-6 w-6 text-muted-foreground/30" />
          <p className="text-[11px] text-muted-foreground">No recent issues</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/40 transition-colors group cursor-default"
            >
              {/* Status dot */}
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: issue.statusColor }}
              />

              {/* Number + title */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    #{issue.number}
                  </span>
                  <p className="text-[12px] font-medium text-foreground/90 truncate group-hover:text-foreground transition-colors">
                    {issue.title}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(issue.updatedAt))} ago
                </p>
              </div>

              {/* Assignee avatar */}
              <Avatar className="h-5 w-5 shrink-0 border border-border">
                <AvatarImage src={issue.assigneeAvatar || ''} />
                <AvatarFallback className="bg-muted text-[8px] font-bold">
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

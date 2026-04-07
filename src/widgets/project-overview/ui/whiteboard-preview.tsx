import React from 'react'
import { Layers, Lock, Plus } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'

interface Whiteboard {
  id: string
  title: string
  elementCount: number
  updatedAt: string
  isLocked: boolean
}

interface WhiteboardPreviewProps {
  whiteboards: Whiteboard[]
}

export const WhiteboardPreview: React.FC<WhiteboardPreviewProps> = ({ whiteboards }) => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  return (
    <div className="h-full bg-card border border-border rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Whiteboards</h3>
        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
          className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-2.5 overflow-hidden">
        {whiteboards.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg gap-2">
            <Layers className="h-6 w-6 text-muted-foreground/30" />
            <p className="text-[11px] text-muted-foreground">No whiteboards yet</p>
          </div>
        ) : (
          whiteboards.map((wb) => (
            <Link
              key={wb.id}
              to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId"
              params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '', boardId: wb.id }}
              className="relative aspect-video rounded-lg border border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all group overflow-hidden flex flex-col items-center justify-center gap-1"
            >
              <Layers className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
              <p className="text-[10px] font-bold text-muted-foreground group-hover:text-primary uppercase tracking-wide transition-colors">
                {wb.elementCount} Elements
              </p>

              <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-background/80 to-transparent">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-foreground truncate">
                    {wb.title || 'Untitled Board'}
                  </p>
                  {wb.isLocked && <Lock className="h-2.5 w-2.5 text-muted-foreground shrink-0" />}
                </div>
                <p className="text-[9px] text-muted-foreground">
                  {formatDistanceToNow(new Date(wb.updatedAt))} ago
                </p>
              </div>
            </Link>
          ))
        )}

        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
          className="flex items-center justify-center gap-1.5 py-3 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/20 transition-all group text-[11px] font-medium text-muted-foreground hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          New Whiteboard
        </Link>
      </div>
    </div>
  )
}

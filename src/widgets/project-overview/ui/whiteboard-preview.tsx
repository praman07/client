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
  whiteboards: Array<Whiteboard>
}

export const WhiteboardPreview: React.FC<WhiteboardPreviewProps> = ({ whiteboards }) => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  return (
    <div className="h-full bg-layer-1 border border-subtle rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary">Whiteboards</h3>
        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
          className="text-[11px] text-secondary hover:text-accent-primary transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-2.5 overflow-hidden">
        {whiteboards.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-subtle rounded-lg gap-2">
            <Layers className="h-6 w-6 text-tertiary/30" />
            <p className="text-[11px] text-secondary">No whiteboards yet</p>
          </div>
        ) : (
          whiteboards.map((wb) => (
            <Link
              key={wb.id}
              to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId"
              params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '', boardId: wb.id }}
              className="relative aspect-video rounded-lg border border-subtle bg-layer-2 hover:bg-layer-transparent-hover hover:border-accent-subtle transition-all group overflow-hidden flex flex-col items-center justify-center gap-1"
            >
              <Layers className="h-5 w-5 text-tertiary/30 group-hover:text-accent-primary/50 transition-colors" />
              <p className="text-[10px] font-bold text-secondary group-hover:text-accent-primary uppercase tracking-wide transition-colors">
                {wb.elementCount} Elements
              </p>

              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-surface-1/80 to-transparent">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-primary truncate">
                    {wb.title || 'Untitled Board'}
                  </p>
                  {wb.isLocked && <Lock className="h-2.5 w-2.5 text-secondary shrink-0" />}
                </div>
                <p className="text-[9px] text-secondary">
                  {formatDistanceToNow(new Date(wb.updatedAt))} ago
                </p>
              </div>
            </Link>
          ))
        )}

        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
          className="flex items-center justify-center gap-1.5 py-3 rounded-lg border border-dashed border-subtle hover:border-accent-subtle hover:bg-layer-2 transition-all group text-[11px] font-medium text-secondary hover:text-accent-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          New Whiteboard
        </Link>
      </div>
    </div>
  )
}

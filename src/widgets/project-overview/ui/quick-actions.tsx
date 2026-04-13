import React from 'react'
import { FileText, HardDrive, Layout, Plus } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'

const ACTIONS = [
  { label: 'New Issue',   icon: Plus,      to: '/workspace/$workspaceSlug/project/$projectSlug/kanban' as const },
  { label: 'New Page',    icon: FileText,  to: '/workspace/$workspaceSlug/project/$projectSlug/pages' as const },
  { label: 'Whiteboard',  icon: Layout,    to: '/workspace/$workspaceSlug/project/$projectSlug/whiteboard' as const },
  { label: 'Upload',      icon: HardDrive, to: '/workspace/$workspaceSlug/project/$projectSlug/vault' as const },
] as const

export const QuickActions: React.FC = () => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  return (
    <div className="h-full bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map(({ label, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border bg-muted/10 hover:bg-primary/5 hover:border-primary/40 transition-all group"
          >
            <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

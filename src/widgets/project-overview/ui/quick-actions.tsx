import React from 'react'
import { FileText, HardDrive, Layout, Plus } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'

const ACTIONS = [
  { label: 'New Issue',   icon: Plus,      to: '/workspace/$workspaceSlug/project/$projectSlug/issues' as const },
  { label: 'New Page',    icon: FileText,  to: '/workspace/$workspaceSlug/project/$projectSlug/pages' as const },
  { label: 'Whiteboard',  icon: Layout,    to: '/workspace/$workspaceSlug/project/$projectSlug/whiteboard' as const },
  { label: 'Upload',      icon: HardDrive, to: '/workspace/$workspaceSlug/project/$projectSlug/vault' as const },
] as const

export const QuickActions: React.FC = () => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  return (
    <div className="h-full bg-layer-1 border border-subtle rounded-xl p-5">
      <h3 className="text-sm font-semibold text-primary mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map(({ label, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-subtle bg-layer-transparent hover:bg-layer-transparent-hover hover:border-accent-subtle transition-all group"
          >
            <div className="h-8 w-8 rounded-lg bg-layer-2 flex items-center justify-center group-hover:bg-accent-subtle transition-colors">
              <Icon className="h-4 w-4 text-secondary group-hover:text-accent-primary transition-colors" />
            </div>
            <span className="text-[11px] font-medium text-secondary group-hover:text-primary transition-colors text-center leading-tight">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

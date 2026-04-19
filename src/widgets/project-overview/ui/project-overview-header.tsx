import React from 'react'
import { Link } from '@tanstack/react-router'
import { Archive, CheckCircle2, Lock, Settings, UserPlus } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'
import { Guard } from '@/shared/lib/auth/guard'
import { PLUGIN_TAB_REGISTRY } from '@/shared/config/navigation'
import { useAppDispatch } from '@/shared/hooks'
import { openAddMemberDialog } from '@/features/project/add-project-member'

interface ProjectOverviewHeaderProps {
  name: string
  projectKey: string
  description?: string | null
  isPrivate?: boolean | null
  isArchived?: boolean | null
  activePlugins: Array<string>
  /** Absolute base path for this project, e.g. "/workspace/my-ws/project/my-proj" */
  projectBasePath: string
}

const PLUGIN_ICONS: Record<string, React.ReactNode> = {
  ISSUES:     <span className="text-10">⊙</span>,
  PAGES:      <span className="text-10">□</span>,
  CHAT:       <span className="text-10">⌥</span>,
  VAULT:      <span className="text-10">⊞</span>,
  WHITEBOARD: <span className="text-10">⊟</span>,
}

export function ProjectOverviewHeader({
  name,
  projectKey,
  description,
  isPrivate,
  isArchived,
  activePlugins,
  projectBasePath,
}: ProjectOverviewHeaderProps) {
  const dispatch = useAppDispatch()
  /** Only show tabs that are active, in registry order */
  const pluginPills = Object.entries(PLUGIN_TAB_REGISTRY)
    .filter(([key]) => activePlugins.includes(key))
    .map(([key, tab]) => ({
      key,
      label: tab.label,
      // Convert relative href "./chat" → absolute "/workspace/.../project/.../chat"
      href: `${projectBasePath}/${tab.href.replace('./', '')}`,
    }))

  const settingsPath = `${projectBasePath}/settings/general`

  return (
    <div className="flex flex-col gap-3 pb-2">
      {/* ── Main row ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        {/* LEFT: name + badges + description */}
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Project name */}
            <h1 className="text-xl font-bold leading-tight text-primary">
              {name}
            </h1>

            {/* Key badge */}
            <span className="shrink-0 rounded border border-subtle bg-layer-2 px-1.5 py-0.5 font-mono text-10 font-semibold uppercase tracking-wider text-secondary">
              {projectKey}
            </span>

            {/* Privacy badge */}
            {isPrivate && (
              <span className="flex shrink-0 items-center gap-1 rounded border border-subtle bg-layer-2 px-1.5 py-0.5 text-10 font-semibold text-secondary">
                <Lock className="h-2.5 w-2.5" />
                Private
              </span>
            )}

            {/* Active/Archived status */}
            {isArchived ? (
              <span className="flex shrink-0 items-center gap-1 rounded border border-warning-subtle bg-warning-subtle px-1.5 py-0.5 text-10 font-semibold text-warning-primary">
                <Archive className="h-2.5 w-2.5" />
                Archived
              </span>
            ) : (
              <span className="flex shrink-0 items-center gap-1 rounded border border-success-subtle bg-success-subtle px-1.5 py-0.5 text-10 font-semibold text-success-primary">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Active
              </span>
            )}
          </div>

          {description && (
            <p className="max-w-xl text-14 leading-relaxed text-secondary">
              {description}
            </p>
          )}
        </div>

        {/* RIGHT: plugin pills + invite + settings */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {pluginPills.map((pill) => (
            <Link
              key={pill.key}
              to={pill.href as any}
              className="flex items-center gap-1.5 rounded-md border border-subtle bg-layer-2 px-3 py-1.5 text-12 font-medium text-secondary transition-colors hover:border-accent-subtle hover:bg-accent-subtle hover:text-primary"
            >
              {PLUGIN_ICONS[pill.key]}
              {pill.label}
            </Link>
          ))}

          {/* Add Member — guarded by project:member:add */}
          <Guard permission="project:member:add">
            <Button
              size="sm"
              variant="default"
              onClick={() => dispatch(openAddMemberDialog())}
              className="h-8 shrink-0 px-3 text-12 font-semibold"
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Add Member
            </Button>
          </Guard>

          {/* Settings cog */}
          <Link
            to={settingsPath as any}
            aria-label="Project settings"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-subtle bg-layer-2 text-secondary transition-colors hover:bg-layer-transparent-hover hover:text-primary"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px border-subtle" />
    </div>
  )
}

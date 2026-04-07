import React from 'react'
import { Link } from '@tanstack/react-router'
import { Settings, Lock, CheckCircle2, Archive, UserPlus } from 'lucide-react'
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
  activePlugins: string[]
  /** Absolute base path for this project, e.g. "/workspace/my-ws/project/my-proj" */
  projectBasePath: string
}

const PLUGIN_ICONS: Record<string, React.ReactNode> = {
  ISSUES:     <span className="text-[10px]">⊙</span>,
  PAGES:      <span className="text-[10px]">□</span>,
  CHAT:       <span className="text-[10px]">⌥</span>,
  VAULT:      <span className="text-[10px]">⊞</span>,
  WHITEBOARD: <span className="text-[10px]">⊟</span>,
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
            <h1 className="text-xl font-bold leading-tight text-foreground">
              {name}
            </h1>

            {/* Key badge */}
            <span className="shrink-0 rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {projectKey}
            </span>

            {/* Privacy badge */}
            {isPrivate && (
              <span className="flex shrink-0 items-center gap-1 rounded border border-border bg-muted/20 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                <Lock className="h-2.5 w-2.5" />
                Private
              </span>
            )}

            {/* Active/Archived status */}
            {isArchived ? (
              <span className="flex shrink-0 items-center gap-1 rounded border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-600 dark:text-yellow-400">
                <Archive className="h-2.5 w-2.5" />
                Archived
              </span>
            ) : (
              <span className="flex shrink-0 items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Active
              </span>
            )}
          </div>

          {description && (
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
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
              className="flex items-center gap-1.5 rounded-md border border-border bg-muted/20 px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
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
              className="h-8 shrink-0 px-3 text-[12px] font-semibold"
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Add Member
            </Button>
          </Guard>

          {/* Settings cog */}
          <Link
            to={settingsPath as any}
            aria-label="Project settings"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/20 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />
    </div>
  )
}

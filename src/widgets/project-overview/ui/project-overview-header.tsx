import { Archive, CheckCircle2, Lock } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'
import { Guard } from '@/shared/lib/auth/guard'
import { useAppDispatch } from '@/shared/hooks'
import { openAddMemberDialog } from '@/features/project/add-project-member'

interface ProjectOverviewHeaderProps {
  name: string
  projectKey: string
  description?: string | null
  isPrivate?: boolean | null
  isArchived?: boolean | null
}

export function ProjectOverviewHeader({
  name,
  projectKey,
  description,
  isPrivate,
  isArchived,
}: ProjectOverviewHeaderProps) {
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main row ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

        {/* LEFT: name + badges + description */}
        <div className="flex min-w-0 flex-col gap-1">
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

        {/* RIGHT: Add Member button */}
        <div className="shrink-0">
          <Guard permission="project:member:add">
            <Button
              size="sm"
              variant="default"
              onClick={() => dispatch(openAddMemberDialog())}
              className="h-8 px-3 text-13 font-medium"
            >
              Add Member
            </Button>
          </Guard>
        </div>
      </div>
    </div>
  )
}
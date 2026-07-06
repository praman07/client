import { Plus, Shield } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/primitives/button'
import { Badge } from '@/shared/ui/primitives/badge'
import { Guard } from '@/shared/lib/auth'
import { useCreateProjectRoleModal } from '@/features/project/create-project-role'

export type ProjectRole = {
  id: string
  name: string
  description?: string | null
  isSystem: boolean
  rank: number
  permissions: Array<{ id: string; name: string }>
}

interface ProjectRoleListProps {
  roles: Array<ProjectRole>
  selectedRoleId?: string
  onSelect: (roleId: string) => void
}

export function ProjectRoleList({
  roles,
  selectedRoleId,
  onSelect,
}: ProjectRoleListProps) {
  const { open: openCreateModal } = useCreateProjectRoleModal()

  // Sort: system first (by rank desc), then custom (by rank desc)
  const sortedRoles = [...roles].sort((a, b) => {
    if (a.isSystem && !b.isSystem) return -1
    if (!a.isSystem && b.isSystem) return 1
    return b.rank - a.rank
  })

  return (
    <div className="flex flex-col border border-subtle rounded-lg bg-layer-1 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-subtle bg-layer-2 flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary shrink-0" />
        <h3 className="text-14 font-semibold flex-1">Project Roles</h3>
      </div>

      {/* New Role Button — shown only to users with project:role:create */}
      <Guard permission="project:role:create">
        <div className="px-3 pt-3 pb-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start gap-2 h-8 text-12 font-medium border-dashed hover:border-primary/50 hover:text-primary"
            onClick={openCreateModal}
          >
            <Plus className="h-3.5 w-3.5" />
            New Role
          </Button>
        </div>
      </Guard>

      {/* Role Items */}
      <div className="overflow-auto px-3 py-2 space-y-1">
        {sortedRoles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={cn(
              'w-full flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-md text-left transition-all group',
              selectedRoleId === role.id
                ? 'bg-accent-subtle text-accent-primary ring-1 ring-accent-subtle'
                : 'hover:bg-layer-1 text-secondary hover:text-primary'
            )}
          >
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-14 font-medium truncate">{role.name}</span>
              {role.isSystem && (
                <Badge
                  variant="outline"
                  className="text-[9px] h-4 px-1.5 py-0 uppercase tracking-wider opacity-60 shrink-0"
                >
                  System
                </Badge>
              )}
            </div>
            {role.description && (
              <p className="text-[11px] line-clamp-2 opacity-60 group-hover:opacity-90 leading-tight">
                {role.description}
              </p>
            )}
            <span className="text-[10px] opacity-40 mt-0.5">Rank {role.rank}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

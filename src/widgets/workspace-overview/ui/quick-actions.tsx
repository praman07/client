import { ChevronRight, PlusCircle, UploadCloud, UserPlus } from 'lucide-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Card } from '@/shared/ui'
import { Guard } from '@/shared/lib/auth/guard'
import { useCreateProjectModal } from '@/features/project/create-project'
import { useInviteMemberModal } from '@/features/invite-member'

interface Action {
  id: string
  label: string
  icon: React.ElementType
  permission: 'project:create' | 'workspace:member:invite' | null
  onClick: () => void
}

export function QuickActions() {
  const navigate = useNavigate()
  const { workspaceSlug } = useParams({ strict: false })
  const { open: openCreateProject } = useCreateProjectModal()
  const { open: openInvite } = useInviteMemberModal()

  const actions: Array<Action> = [
    {
      id: 'create-project',
      label: 'Create Project',
      icon: PlusCircle,
      permission: 'project:create',
      onClick: openCreateProject,
    },
    {
      id: 'invite-members',
      label: 'Invite Members',
      icon: UserPlus,
      permission: 'workspace:member:invite',
      onClick: openInvite,
    },
    {
      id: 'upload-file',
      label: 'Upload File',
      icon: UploadCloud,
      permission: null,
      // Route not built yet — navigate when available
      onClick: () => {
        if (workspaceSlug) void navigate({ to: `/workspace/${workspaceSlug}/vault` as any })
      },
    },
  ]

  return (
<Card className="flex flex-col p-6 shadow-raised-100 border border-subtle bg-layer-1">
  <h3 className="text-14 font-semibold text-primary mb-5 tracking-tight">Quick Actions</h3>
  <div className="flex flex-col space-y-2.5">
    {actions.map(({ id, label, icon: Icon, permission, onClick }) => {
      const button = (
        <button
          key={id}
          onClick={onClick}
          className="flex items-center justify-between p-3 rounded-lg border border-subtle bg-layer-2 hover:bg-layer-2-hover hover:border-accent-subtle transition-all group w-full text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-surface-1 text-primary group-hover:text-accent-primary group-hover:bg-accent-subtle transition-colors">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-13 font-semibold text-primary group-hover:text-accent-primary transition-colors">
              {label}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-secondary group-hover:text-accent-primary transition-colors group-hover:translate-x-0.5" />
        </button>
      )

          // Permission-gated actions — hidden for unauthorized users
          if (permission) {
            return (
              <Guard key={id} permission={permission}>
                {button}
              </Guard>
            )
          }

          return button
        })}
      </div>
    </Card>
  )
}

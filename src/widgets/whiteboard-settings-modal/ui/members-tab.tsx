import { useState } from 'react'
import { Lock, UserPlus, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Board } from '@/entities/whiteboard-board'
import {
  useAddCollaborators,
  useBoardCollaborators,
} from '@/features/whiteboard/add-collaborators'
import {
  RemoveCollaboratorDialog,
  useRemoveCollaborator,
} from '@/features/whiteboard/remove-collaborator'
import { useWorkspaceMembers } from '@/features/view-members/hooks'
import { Button } from '@/shared/ui/primitives/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/primitives/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/primitives/popover'
import { usePermission } from '@/shared/lib/auth/use-permission'

interface Collaborator {
  userId: string
  user: {
    id: string
    fullName: string
    email: string
    avatarUrl: string | null
  }
}

interface MembersTabProps {
  board: Board
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Members tab for WhiteboardSettingsModal.
 *
 * Permission gates:
 * - `whiteboard:collaborator:read`   → see the collaborator list
 * - `whiteboard:collaborator:add`    → show the Add popover button
 * - `whiteboard:collaborator:remove` → show the remove (X) button per row
 */
export function MembersTab({ board }: MembersTabProps) {
  const canRead = usePermission('whiteboard:collaborator:read')
  const canAdd = usePermission('whiteboard:collaborator:add')
  const canRemove = usePermission('whiteboard:collaborator:remove')

  const { data: collaboratorsData } = useBoardCollaborators(board.id)
  const { data: workspaceMembersData } = useWorkspaceMembers(board.workspaceId)
  const addCollaborators = useAddCollaborators()
  const removeCollaborator = useRemoveCollaborator()

  const [addOpen, setAddOpen] = useState(false)
  const [collaboratorToRemove, setCollaboratorToRemove] =
    useState<Collaborator | null>(null)
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false)

  const collaborators: Array<Collaborator> =
    (collaboratorsData as any)?.boardCollaborators ?? []
  const workspaceMembers: Array<any> =
    (workspaceMembersData as any)?.workspaceMembers ?? []

  const collaboratorIds = new Set(collaborators.map((c) => c.userId))
  const availableToAdd = workspaceMembers.filter(
    (m: any) => !collaboratorIds.has(m.userId ?? m.id),
  )

  const handleAdd = async (memberId: string, memberName: string) => {
    try {
      await addCollaborators.mutateAsync({
        boardId: board.id,
        userIds: [memberId],
      })
      toast.success(`Added ${memberName}`)
    } catch {
      toast.error('Failed to add collaborator')
    }
    setAddOpen(false)
  }

  const handleRemoveClick = (collaborator: Collaborator) => {
    setCollaboratorToRemove(collaborator)
    setConfirmRemoveOpen(true)
  }

  // ── If user can't read collaborators at all ──────────
  if (!canRead) {
    return (
<div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
      <Lock className="h-8 w-8 text-tertiary/40" />
      <p className="text-14 text-secondary">
        You don't have permission to view collaborators.
      </p>
    </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Header ────────────────────────────────────── */}
<div className="flex items-center justify-between">
      <p className="text-14 text-secondary">
          {collaborators.length === 0
            ? 'No collaborators yet'
            : `${collaborators.length} collaborator${collaborators.length !== 1 ? 's' : ''}`}
        </p>

        {/* Add — only for users with whiteboard:collaborator:add */}
        {canAdd && (
          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <PopoverTrigger>
              <Button size="sm" variant="outline" className="gap-1.5" asChild={false}>
                <UserPlus className="h-4 w-4" />
                Add
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-72" align="end">
              <Command>
                <CommandInput placeholder="Search workspace members…" />
                <CommandList>
                  <CommandEmpty>No members found.</CommandEmpty>
                  <CommandGroup>
                    {availableToAdd.map((m: any) => {
                      const userId = m.userId ?? m.id
                      const user = m.user ?? m
                      return (
                        <CommandItem
                          key={userId}
                          value={`${user.fullName} ${user.email}`}
                          onSelect={() => handleAdd(userId, user.fullName)}
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={user.avatarUrl ?? ''} />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
<div className="flex flex-col">
                  <span className="text-14">{user.fullName}</span>
                  <span className="text-12 text-secondary">
                    {user.email}
                  </span>
                </div>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* ── Collaborator list ──────────────────────────── */}
      {collaborators.length > 0 ? (
        <ul className="space-y-1">
          {collaborators.map((c) => (
            <li
              key={c.userId}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-layer-1-hover transition-colors group"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={c.user.avatarUrl ?? ''} />
                <AvatarFallback className="text-xs">
                  {getInitials(c.user.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
<p className="text-14 font-medium truncate">{c.user.fullName}</p>
              <p className="text-12 text-secondary truncate">
                {c.user.email}
              </p>
              </div>

              {/* Remove — only for users with whiteboard:collaborator:remove */}
              {canRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-secondary hover:text-danger-primary hover:bg-danger-subtle"
                  onClick={() => handleRemoveClick(c)}
                  disabled={removeCollaborator.isPending}
                  aria-label={`Remove ${c.user.fullName}`}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      ) : (
<div className="text-center py-8">
      <p className="text-14 text-secondary">
        {canAdd
          ? 'No collaborators yet. Add someone to get started.'
          : 'No collaborators yet.'}
      </p>
    </div>
      )}

      {/* Remove confirmation dialog */}
      <RemoveCollaboratorDialog
        boardId={board.id}
        collaborator={collaboratorToRemove}
        open={confirmRemoveOpen}
        onOpenChange={setConfirmRemoveOpen}
      />
    </div>
  )
}

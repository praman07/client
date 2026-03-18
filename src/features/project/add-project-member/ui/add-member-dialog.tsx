import { useState } from 'react'
import { Check } from 'lucide-react'
import {
  closeAddMemberDialog,
  selectIsAddMemberDialogOpen,
} from '../model/slice'
import { useAddProjectMember } from '../hooks/use-add-project-member'
import { cn } from '@/shared/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { useWorkspaceMembers } from '@/features/view-members/hooks'

interface AddMemberDialogProps {
  projectId: string
  workspaceId: string
  existingMemberIds: Array<string>
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getScrollHeight(count: number) {
  if (count === 0) return 'h-[80px]'
  if (count <= 3) return 'h-auto max-h-[220px]'
  if (count <= 6) return 'h-[320px]'
  return 'h-[400px]'
}

export function AddMemberDialog({
  projectId,
  workspaceId,
  existingMemberIds,
}: AddMemberDialogProps) {
  const isOpen = useAppSelector(selectIsAddMemberDialogOpen)
  const dispatch = useAppDispatch()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const { mutate: addMember, isPending } = useAddProjectMember()

  const { data: membersData, isLoading } = useWorkspaceMembers(workspaceId)
  const workspaceMembers = membersData?.workspaceMembers ?? []
  const availableMembers = workspaceMembers.filter(
    (m) => !existingMemberIds.includes(m.user.id),
  )

  function handleClose() {
    dispatch(closeAddMemberDialog())
    setSelectedUserId(null)
  }

  function handleAdd() {
    if (!selectedUserId) return
    addMember(
      { projectId, workspaceId, userId: selectedUserId },
      { onSuccess: handleClose },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Select a workspace member to add to this project.
          </DialogDescription>
        </DialogHeader>

        <div className="py-1">
          {isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading members...
            </div>
          ) : availableMembers.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              All workspace members are already in this project.
            </div>
          ) : (
            <ScrollArea
              className={cn(
                getScrollHeight(availableMembers.length),
                'rounded-md border',
              )}
            >
              <div className="p-2 space-y-1">
                {availableMembers.map((member) => {
                  const isSelected = selectedUserId === member.user.id
                  return (
                    <button
                      key={member.user.id}
                      type="button"
                      onClick={() =>
                        setSelectedUserId(isSelected ? null : member.user.id)
                      }
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent',
                        isSelected && 'bg-accent',
                      )}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={member.user.avatarUrl ?? ''} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.user.fullName ?? 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {member.user.fullName ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.user.email}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!selectedUserId || isPending}>
            {isPending ? 'Adding...' : 'Add Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

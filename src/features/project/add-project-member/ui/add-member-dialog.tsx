import { useState } from 'react'
import { Check, Users } from 'lucide-react'
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { useWorkspaceMembers } from '@/entities/workspace'

interface AssignableRole {
  id: string
  name: string
  rank: number
}

interface AddMemberDialogProps {
  projectId: string
  workspaceId: string
  existingMemberIds: Array<string>
  assignableRoles: Array<AssignableRole>
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function AddMemberDialog({
  projectId,
  workspaceId,
  existingMemberIds,
  assignableRoles,
}: AddMemberDialogProps) {
  const isOpen = useAppSelector(selectIsAddMemberDialogOpen)
  const dispatch = useAppDispatch()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    assignableRoles[0]?.id ?? '',
  )
  const { mutate: addMember, isPending } = useAddProjectMember()

  const { data: membersData, isLoading } = useWorkspaceMembers(workspaceId)
  const workspaceMembers = membersData?.workspaceMembers ?? []
  const availableMembers = workspaceMembers.filter(
    (m) => !existingMemberIds.includes(m.user.id),
  )

  function handleClose() {
    dispatch(closeAddMemberDialog())
    setSelectedUserId(null)
    setSelectedRoleId(assignableRoles[0]?.id ?? '')
  }

  function handleAdd() {
    if (!selectedUserId || !selectedRoleId) return
    addMember(
      { projectId, workspaceId, userId: selectedUserId, roleId: selectedRoleId },
      { onSuccess: handleClose },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Select a workspace member and assign them a project role.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-5">
          {/* Role selector */}
          {assignableRoles.length > 0 && (
            <div className="space-y-1.5 flex flex-col">
              <label 
                htmlFor="project-role" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Role
              </label>
              <Select
                value={selectedRoleId}
                onValueChange={(val) => val && setSelectedRoleId(val)}
              >
                <SelectTrigger id="project-role" className="w-full">
                  <span className="flex-1 text-left text-sm truncate">
                    {assignableRoles.find((r) => r.id === selectedRoleId)?.name ?? 'Select a role'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Member list */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Member
            </label>
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground border rounded-md">
                Loading members...
              </div>
            ) : availableMembers.length === 0 ? (
              <div className="border rounded-md">
                <Empty className="p-8 border-none">
                  <EmptyMedia variant="icon"><Users /></EmptyMedia>
                  <EmptyContent>
                    <EmptyTitle>No Members Available</EmptyTitle>
                    <EmptyDescription>All workspace members are already in this project.</EmptyDescription>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              <ScrollArea
                className="max-h-[min(400px,60dvh)] rounded-md border"
              >
                <div className="p-1 space-y-0.5">
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
                          'flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left transition-colors hover:bg-muted/50 hover:text-foreground',
                          isSelected && 'bg-muted/50',
                        )}
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={member.user.avatarUrl ?? ''} />
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground border">
                            {getInitials(member.user.fullName ?? member.user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate tracking-tight text-foreground">
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
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedUserId || !selectedRoleId || isPending}
          >
            {isPending ? 'Adding...' : 'Add Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

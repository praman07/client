import { useState } from 'react'
import { Check, Search, Users, X } from 'lucide-react'
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
  Input,
  ScrollArea,
} from '@/shared/ui'
import { useWorkspaceMembers } from '@/entities/workspace'
import { useAddChannelMembers } from '@/features/chat/channel-members'

interface AddMembersDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  channelId: string
  workspaceId: string
  existingMemberIds: Array<string>
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export function AddMembersDialog({
  isOpen,
  onOpenChange,
  channelId,
  workspaceId,
  existingMemberIds,
}: AddMembersDialogProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<Array<string>>([])
  const [search, setSearch] = useState('')
  const { mutate: addMembers, isPending } = useAddChannelMembers(channelId)

  const { data: membersData, isLoading } = useWorkspaceMembers(workspaceId)
  const workspaceMembers = membersData?.workspaceMembers ?? []
  
  const availableMembers = workspaceMembers.filter(
    (m) => !existingMemberIds.includes(m.user.id)
  ).filter((m) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (m.user.fullName ?? '').toLowerCase().includes(q) ||
      m.user.email.toLowerCase().includes(q)
    )
  })

  function handleClose() {
    onOpenChange(false)
    setSelectedUserIds([])
    setSearch('')
  }

  function handleAdd() {
    if (selectedUserIds.length === 0) return
    addMembers(
      { workspaceId, userIds: selectedUserIds },
      { onSuccess: handleClose }
    )
  }

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[440px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Add members</DialogTitle>
          <DialogDescription>
            Invite workspace members to this channel.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary pointer-events-none" />
            <Input
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-14 bg-layer-2 border-subtle-1"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-11 font-semibold uppercase tracking-widest text-tertiary">
              Select members ({selectedUserIds.length} selected)
            </label>
            
            <ScrollArea className="h-[300px] rounded-md border-subtle-1">
              {isLoading ? (
                <div className="p-8 text-center text-14 text-secondary">
                  Loading workspace members...
                </div>
              ) : availableMembers.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                   <div className="flex justify-center">
                     <Users className="size-8 text-tertiary" />
                   </div>
                   <p className="text-14 text-balance text-secondary">
                     {search ? `No members match "${search}"` : 'All workspace members are already joined.'}
                   </p>
                </div>
              ) : (
                <div className="p-1 space-y-0.5">
                  {availableMembers.map((member) => {
                    const isSelected = selectedUserIds.includes(member.user.id)
                    return (
                      <button
                        key={member.user.id}
                        type="button"
                        onClick={() => toggleUser(member.user.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left transition-colors hover:bg-layer-1-hover hover:text-primary',
                          isSelected && 'bg-layer-1',
                        )}
                      >
                        <Avatar className="h-8 w-8 shrink-0 border-subtle-1">
                          <AvatarImage src={member.user.avatarUrl ?? ''} />
                          <AvatarFallback className="text-10 font-bold bg-layer-1 text-secondary">
                            {getInitials(member.user.fullName ?? member.user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-14 font-medium truncate text-primary leading-none mb-1">
                            {member.user.fullName ?? 'Unknown'}
                          </p>
                          <p className="text-11 text-secondary truncate leading-none">
                            {member.user.email}
                          </p>
                        </div>
                        <div className={cn(
                          "size-4 rounded border flex items-center justify-center transition-colors",
                          isSelected ? "bg-accent-primary border-accent-strong" : "border-subtle-1"
                        )}>
                          {isSelected && <Check className="size-3 text-on-color stroke-[3px]" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-layer-1 border-t border-subtle-1">
          <Button variant="ghost" onClick={handleClose} disabled={isPending} className="h-8 text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedUserIds.length === 0 || isPending}
            className="h-8 text-xs px-4"
          >
            {isPending ? 'Adding...' : `Add ${selectedUserIds.length > 0 ? selectedUserIds.length : ''} Member${selectedUserIds.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

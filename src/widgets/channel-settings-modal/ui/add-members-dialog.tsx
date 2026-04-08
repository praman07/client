import { useState } from 'react'
import { Check, Users, Search, X } from 'lucide-react'
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
  Input,
} from '@/shared/ui'
import { useWorkspaceMembers } from '@/entities/workspace'
import { useAddChannelMembers } from '@/features/chat/channel-members'

interface AddMembersDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  channelId: string
  workspaceId: string
  existingMemberIds: string[]
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
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm bg-muted/20 border-border/50"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Select members ({selectedUserIds.length} selected)
            </label>
            
            <ScrollArea className="h-[300px] rounded-md border border-border/50">
              {isLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Loading workspace members...
                </div>
              ) : availableMembers.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                   <div className="flex justify-center">
                     <Users className="size-8 text-muted-foreground/40" />
                   </div>
                   <p className="text-sm text-balance text-muted-foreground">
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
                          'flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left transition-colors hover:bg-muted/50 hover:text-foreground',
                          isSelected && 'bg-muted/30',
                        )}
                      >
                        <Avatar className="h-8 w-8 shrink-0 border border-border/40">
                          <AvatarImage src={member.user.avatarUrl ?? ''} />
                          <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                            {getInitials(member.user.fullName ?? member.user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate text-foreground leading-none mb-1">
                            {member.user.fullName ?? 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate leading-none">
                            {member.user.email}
                          </p>
                        </div>
                        <div className={cn(
                          "size-4 rounded border flex items-center justify-center transition-colors",
                          isSelected ? "bg-primary border-primary" : "border-border/60"
                        )}>
                          {isSelected && <Check className="size-3 text-primary-foreground stroke-[3px]" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 bg-muted/10 border-t border-border/50">
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

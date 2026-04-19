import { useMemo, useState } from 'react'
import { Check, Search, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { ScrollArea } from '@/shared/ui/primitives/scroll-area'
import { Input } from '@/shared/ui/primitives/input'
import { Badge } from '@/shared/ui/primitives/badge'
import { Label } from '@/shared/ui/primitives/label'
import { useWorkspaceMembers } from '@/features/view-members/hooks'

interface CollaboratorPickerProps {
  workspaceId: string
  selectedUserIds: Array<string>
  onChange: (userIds: Array<string>) => void
  currentUserId?: string
}

/**
 * Multi-select user picker for workspace members
 *
 * Features:
 * - Search/filter members by name or email
 * - Multi-select with visual feedback
 * - Pre-selects current user as owner
 * - Shows selected users as removable badges
 *
 * @layer Features
 * @module whiteboard/create-board
 */
export function CollaboratorPicker({
  workspaceId,
  selectedUserIds,
  onChange,
  currentUserId,
}: CollaboratorPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading } = useWorkspaceMembers(workspaceId)

  const members = useMemo(
    () => data?.workspaceMembers || [],
    [data?.workspaceMembers],
  )

  // Filter by search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members
    const query = searchQuery.toLowerCase()
    return members.filter((m) => {
      const fullName = m.user.fullName || ''
      const email = m.user.email || ''
      return (
        fullName.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query)
      )
    })
  }, [members, searchQuery])

  const toggleMember = (userId: string) => {
    if (userId === currentUserId) return // Owner cannot be removed

    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter((id) => id !== userId))
    } else {
      onChange([...selectedUserIds, userId])
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Add Collaborators (Optional)</Label>
        <div className="text-sm text-secondary">Loading members...</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label>Add Collaborators (Optional)</Label>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Selected Members as Badges */}
      {selectedUserIds.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-layer-2 rounded-md">
          <span className="text-xs text-secondary w-full mb-1">
            Selected ({selectedUserIds.length}):
          </span>
          {selectedUserIds.map((userId) => {
            const member = members.find((m) => m.user.id === userId)
            if (!member) return null
            const isOwner = userId === currentUserId
            return (
              <Badge key={userId} variant="secondary" className="gap-1.5 pr-1">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={member.user.avatarUrl || ''} />
                  <AvatarFallback className="text-[8px]">
                    {getInitials(member.user.fullName || 'User')}
                  </AvatarFallback>
                </Avatar>
                <span>{member.user.fullName}</span>
                {isOwner && <span className="text-xs text-secondary">(You)</span>}
                {!isOwner && (
                  <button
                    type="button"
                    onClick={() => toggleMember(userId)}
                    className="ml-1 rounded-sm hover:bg-layer-2 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            )
          })}
        </div>
      )}

      {/* Member List */}
      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-2 space-y-1">
          {filteredMembers.length === 0 ? (
            <div className="text-sm text-secondary text-center py-8">
              {searchQuery ? 'No members found' : 'No workspace members'}
            </div>
          ) : (
            filteredMembers.map((member) => {
              const isSelected = selectedUserIds.includes(member.user.id)
              const isOwner = member.user.id === currentUserId
              return (
                <button
                  key={member.user.id}
                  type="button"
                  onClick={() => toggleMember(member.user.id)}
                  disabled={isOwner}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md p-2 transition-colors',
                    isSelected && 'bg-accent-subtle',
                    !isOwner && 'hover:bg-layer-2 cursor-pointer',
                    isOwner && 'text-tertiary cursor-not-allowed',
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={member.user.avatarUrl || ''} />
                    <AvatarFallback className="text-xs">
                      {getInitials(member.user.fullName || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate text-primary">
                      {member.user.fullName}
                      {isOwner && (
                        <span className="ml-2 text-xs text-secondary">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-secondary truncate">
                      {member.user.email}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-accent-primary shrink-0" />
                  )}
                </button>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

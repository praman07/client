import { useState } from 'react'
import { Search, UserPlus, X } from 'lucide-react'
import { AddMembersDialog } from './add-members-dialog'
import type { ConversationFieldsFragment, ConversationMember } from '@/gql/graphql'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { useAuthorizationContext, usePermission } from '@/shared/lib/auth'
import { useAuth } from '@/shared/hooks'
import { useRemoveChannelMember } from '@/features/chat/channel-members'
import { useUserProfilePanel } from '@/features/chat/user-profile-panel'
import { ScrollArea } from '@/shared/ui/primitives/scroll-area'

interface MembersTabProps {
  conversation: ConversationFieldsFragment
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const ROLE_COLORS: Record<string, string> = {
  OWNER:       'bg-layer-1 text-warning-primary border-warning-subtle',
  ADMIN:       'bg-layer-1 text-accent-primary border-accent-subtle',
  MANAGER:     'bg-layer-1 text-accent-primary border-accent-subtle',
  CONTRIBUTOR: 'bg-layer-1 text-success-primary border-success-subtle',
  VIEWER:      'bg-layer-1 text-secondary border-subtle-1',
  MEMBER:      'bg-layer-1 text-secondary border-subtle',
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-14 text-secondary">
        {query ? `No members match "${query}"` : 'No members yet.'}
      </p>
    </div>
  )
}

// ── Member Row ─────────────────────────────────────────────────────────────────
interface MemberRowProps {
  member: ConversationMember
  isCurrentUser: boolean
  canRemove: boolean
  onRemove: () => void
  projectId: string
  onOpenProfile: (userId: string, projectId: string) => void
}

function MemberRow({ member, isCurrentUser, canRemove, onRemove, onOpenProfile, projectId }: MemberRowProps) {
  const roleColor = ROLE_COLORS[member.role] ?? ROLE_COLORS.MEMBER
  return (
    <li className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-layer-1-hover group transition-colors">
      <Avatar
        className="size-8 shrink-0 border-subtle-1 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onOpenProfile(member.user.id, projectId)}
      >
        <AvatarImage src={member.user.avatarUrl ?? undefined} />
        <AvatarFallback className="text-10 font-bold bg-layer-1 text-secondary">
          {getInitials(member.user.fullName ?? member.user.email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p
          className="text-14 font-medium text-primary truncate cursor-pointer hover:underline"
          onClick={() => onOpenProfile(member.user.id, projectId)}
        >
          {member.user.fullName ?? member.user.email}
          {isCurrentUser && (
            <span className="ml-1.5 text-11 text-secondary font-normal">(you)</span>
          )}
        </p>
        <p className="text-11 text-secondary truncate">{member.user.email}</p>
      </div>

      <span
        className={`text-10 font-semibold px-1.5 py-0.5 rounded border shrink-0 ${roleColor}`}
      >
        {member.role}
      </span>

      {canRemove && !isCurrentUser && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-7 px-2 text-11 text-secondary hover:text-danger-primary hover:bg-danger-subtle opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          Remove
        </Button>
      )}
    </li>
  )
}

// ── Members Tab ────────────────────────────────────────────────────────────────
export function MembersTab({ conversation }: MembersTabProps) {
  const { userId: currentUserId } = useAuth()
  const { isLoading: authLoading } = useAuthorizationContext()
  const canAdd = usePermission('chat:channel:member:add')
  const canRemove = usePermission('chat:channel:member:remove')

  const [search, setSearch] = useState('')
  const [removingUserId, setRemovingUserId] = useState<string | null>(null)
  const [addMembersOpen, setAddMembersOpen] = useState(false)
  const { open: openUserProfile } = useUserProfilePanel()

  const { mutate: removeMember, isPending: removing } = useRemoveChannelMember(conversation.id)

  const members = (conversation.members ?? []) as Array<ConversationMember>

  const filtered = members.filter((m) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (m.user.fullName ?? '').toLowerCase().includes(q) ||
      m.user.email.toLowerCase().includes(q)
    )
  })

  const handleRemove = (userId: string) => {
    removeMember(
      { workspaceId: conversation.workspaceId, userId },
      { onSuccess: () => setRemovingUserId(null) },
    )
  }

  if (authLoading) return null

  return (
    <div className="space-y-4">

      {/* ── Search bar — always visible ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary pointer-events-none" />
        <Input
          placeholder="Search members…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-14 bg-layer-2 border-subtle-1 w-full"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* ── Count + Add button ── */}
      <div className="flex items-center justify-between">
        <p className="text-14 font-semibold text-primary">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </p>
        {canAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddMembersOpen(true)}
            className="h-8 text-11 border-subtle-1 gap-1.5"
          >
            <UserPlus className="size-3.5" />
            Add members
          </Button>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-subtle-1" />

      {/* ── Member list ── */}
      {filtered.length === 0 ? (
        <EmptyState query={search} />
      ) : (
        <ScrollArea className="-mx-2 px-2 max-h-64">
          <ul className="space-y-0.5">
            {filtered.map((member) => (
              <MemberRow
                key={member.userId}
                member={member}
                isCurrentUser={member.userId === currentUserId}
                canRemove={canRemove}
                projectId={conversation.projectId ?? ''}
                onRemove={() => setRemovingUserId(member.userId)}
                onOpenProfile={openUserProfile}
              />
            ))}
          </ul>
        </ScrollArea>
      )}

      {/* ── Confirm remove dialog ── */}
      <AlertDialog
        open={!!removingUserId}
        onOpenChange={(open) => !open && setRemovingUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              This person will lose access to the channel and its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemovingUserId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger-primary text-on-color hover:bg-danger-primary/90"
              onClick={() => removingUserId && handleRemove(removingUserId)}
              disabled={removing}
            >
              {removing ? 'Removing…' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Add members dialog ── */}
      <AddMembersDialog
        isOpen={addMembersOpen}
        onOpenChange={setAddMembersOpen}
        channelId={conversation.id}
        workspaceId={conversation.workspaceId}
        existingMemberIds={members.map((m) => m.userId)}
      />
    </div>
  )
}

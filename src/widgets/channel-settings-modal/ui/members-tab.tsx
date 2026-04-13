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
  OWNER:       'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  ADMIN:       'bg-blue-500/10 text-blue-400 border-blue-500/20',
  MANAGER:     'bg-purple-500/10 text-purple-400 border-purple-500/20',
  CONTRIBUTOR: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  VIEWER:      'bg-muted/30 text-muted-foreground border-border/40',
  MEMBER:      'bg-muted/20 text-muted-foreground border-border/30',
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-muted-foreground">
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
  onOpenProfile: (userId: string) => void
}

function MemberRow({ member, isCurrentUser, canRemove, onRemove, onOpenProfile }: MemberRowProps) {
  const roleColor = ROLE_COLORS[member.role] ?? ROLE_COLORS.MEMBER
  return (
    <li className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted/20 group transition-colors">
      <Avatar
        className="size-8 shrink-0 border border-border/40 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onOpenProfile(member.user.id)}
      >
        <AvatarImage src={member.user.avatarUrl ?? undefined} />
        <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
          {getInitials(member.user.fullName ?? member.user.email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium text-foreground truncate cursor-pointer hover:underline"
          onClick={() => onOpenProfile(member.user.id)}
        >
          {member.user.fullName ?? member.user.email}
          {isCurrentUser && (
            <span className="ml-1.5 text-xs text-muted-foreground font-normal">(you)</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
      </div>

      <span
        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0 ${roleColor}`}
      >
        {member.role}
      </span>

      {canRemove && !isCurrentUser && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search members…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm bg-muted/20 border-border/50 w-full"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* ── Count + Add button ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </p>
        {canAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddMembersOpen(true)}
            className="h-8 text-xs border-border/50 gap-1.5"
          >
            <UserPlus className="size-3.5" />
            Add members
          </Button>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border/50" />

      {/* ── Member list ── */}
      {filtered.length === 0 ? (
        <EmptyState query={search} />
      ) : (
        <ul className="space-y-0.5">
          {filtered.map((member) => (
            <MemberRow
              key={member.userId}
              member={member}
              isCurrentUser={member.userId === currentUserId}
              canRemove={canRemove}
              onRemove={() => setRemovingUserId(member.userId)}
              onOpenProfile={openUserProfile}
            />
          ))}
        </ul>
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
              className="bg-destructive text-white hover:bg-destructive/90"
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

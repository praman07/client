import { useState } from 'react'
import { Copy01Icon, Edit02Icon, Globe02Icon, LockIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useChannelSettings } from '../hooks'
import type { Conversation, ConversationFieldsFragment } from '@/gql/graphql'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { Guard } from '@/shared/lib/auth'
import type { AppPermission } from '@/shared/lib/auth'
import { RenameChannelForm, extractChannelNames } from '@/features/chat/rename-channel'
import { useUpdateChannelDescription } from '@/features/chat/update-channel-description'
import { useUpdateChannelVisibility } from '@/features/chat/update-channel-visibility'
import { ConversationType, useUserConversations } from '@/entities/conversation'
import { cn } from '@/shared/lib/utils'

interface AboutTabProps {
  conversation: ConversationFieldsFragment
}

// ── Inline Edit Textarea ───────────────────────────────────────────────────────
interface InlineTextAreaProps {
  value: string
  onChange: (v: string) => void
  onSave: () => void
  onCancel: () => void
  isPending: boolean
  placeholder?: string
  maxLength?: number
}

function InlineTextArea({
  value,
  onChange,
  onSave,
  onCancel,
  isPending,
  placeholder,
  maxLength = 280,
}: InlineTextAreaProps) {
  return (
    <div className="mt-2 space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="resize-none text-sm min-h-[72px] bg-muted/20 border-border/50 w-full"
        maxLength={maxLength}
        autoFocus
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={onSave} disabled={isPending}>
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Copy Button ────────────────────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy channel ID'}
      className={cn(
        'inline-flex items-center transition-colors',
        copied ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
    </button>
  )
}

// ── Section Row ────────────────────────────────────────────────────────────────
interface SectionRowProps {
  title: string
  editPermission?: AppPermission
  onEdit?: () => void
  children: React.ReactNode
}

function SectionRow({ title, editPermission, onEdit, children }: SectionRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <div className="mt-0.5">{children}</div>
      </div>
      {editPermission && onEdit && (
        <Guard permission={editPermission}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="shrink-0 h-7 text-xs text-primary hover:text-primary/80 hover:bg-primary/5 font-medium px-2"
          >
            <HugeiconsIcon icon={Edit02Icon} className="size-3 mr-1" />
            Edit
          </Button>
        </Guard>
      )}
    </div>
  )
}

// ── About Tab ──────────────────────────────────────────────────────────────────
export function AboutTab({ conversation }: AboutTabProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [descValue, setDescValue] = useState(conversation.topic ?? '')
  const { close } = useChannelSettings()

  const { data: channelsData } = useUserConversations(
    {
      workspaceId: conversation.workspaceId,
      projectId: conversation.projectId || undefined,
      type: ConversationType.Channel,
    },
    { staleTime: Infinity, refetchOnWindowFocus: false },
  )

  const existingChannelNames = extractChannelNames(
    channelsData?.getUserConversations.edges as Array<Conversation>,
  )

  const { mutate: updateDescription, isPending: savingDesc } = useUpdateChannelDescription()
  const { mutate: updateVisibility, isPending: togglingVisibility } = useUpdateChannelVisibility()

  const handleNameSuccess = () => {
    setIsEditingName(false)
    close()
  }

  const handleSaveDescription = () => {
    updateDescription(
      {
        workspaceId: conversation.workspaceId,
        channelId: conversation.id,
        description: descValue || null,
      },
      { onSuccess: () => setIsEditingDesc(false) },
    )
  }

  const handleCancelDesc = () => {
    setIsEditingDesc(false)
    setDescValue(conversation.topic ?? '')
  }

  const handleToggleVisibility = () => {
    updateVisibility({
      workspaceId: conversation.workspaceId,
      channelId: conversation.id,
      isPublic: !conversation.isPublic,
    })
  }

  return (
    <div className="space-y-4">

      {/* ── Card group: Name + Description ── */}
      <div className="rounded-lg border border-border/50 divide-y divide-border/40 bg-card/30 overflow-hidden">

        {/* Channel name row */}
        <SectionRow
          title="Channel name"
          editPermission="chat:channel:update"
          onEdit={isEditingName ? undefined : () => setIsEditingName(true)}
        >
          {isEditingName ? (
            <div className="mt-2">
              <RenameChannelForm
                channelId={conversation.id}
                currentName={conversation.name || ''}
                existingNames={existingChannelNames}
                onSuccess={handleNameSuccess}
                onCancel={() => setIsEditingName(false)}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              # {conversation.name}
            </p>
          )}
        </SectionRow>

        {/* Topic row */}
        <SectionRow
          title="Topic"
          editPermission="chat:channel:update"
          onEdit={isEditingDesc ? undefined : () => setIsEditingDesc(true)}
        >
          {isEditingDesc ? (
            <InlineTextArea
              value={descValue}
              onChange={setDescValue}
              onSave={handleSaveDescription}
              onCancel={handleCancelDesc}
              isPending={savingDesc}
              placeholder="What is this channel about?"
              maxLength={280}
            />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed break-words">
              {conversation.topic || (
                <span className="italic">Add a topic</span>
              )}
            </p>
          )}
        </SectionRow>

        {/* Created by row */}
        <div className="px-4 py-3.5">
          <p className="text-sm font-semibold text-foreground">Created</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date(conversation.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

      </div>

      {/* ── Visibility card ── */}
      <div className="flex items-start justify-between gap-4 px-4 py-3.5 rounded-lg border border-border/50 bg-card/30">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 shrink-0 p-1.5 rounded-md bg-muted/30">
            <HugeiconsIcon
              icon={conversation.isPublic ? Globe02Icon : LockIcon}
              className="size-4 text-muted-foreground"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {conversation.isPublic ? 'Public channel' : 'Private channel'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {conversation.isPublic
                ? 'Anyone in the workspace can join and view messages.'
                : 'Only invited members can view this channel.'}
            </p>
          </div>
        </div>
        <Guard permission="chat:channel:update">
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 h-7 text-xs border-border/50"
            onClick={handleToggleVisibility}
            disabled={togglingVisibility}
          >
            {togglingVisibility
              ? 'Saving…'
              : conversation.isPublic
                ? 'Make private'
                : 'Make public'}
          </Button>
        </Guard>
      </div>

      {/* ── Footer meta ── */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs text-muted-foreground">
            Channel ID:{' '}
            <span className="font-mono">{conversation.id}</span>
          </p>
          <CopyButton value={conversation.id} />
        </div>
        {conversation.memberCount != null && (
          <p className="text-xs text-muted-foreground">
            {conversation.memberCount} member{conversation.memberCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

    </div>
  )
}

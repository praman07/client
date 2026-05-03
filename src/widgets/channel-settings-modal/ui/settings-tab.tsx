import { useState } from 'react'
import { Archive } from 'lucide-react'
import { useChannelSettings } from '../hooks'
import type { ConversationFieldsFragment } from '@/gql/graphql'
import { Button } from '@/shared/ui/primitives/button'
import { Guard } from '@/shared/lib/auth'
import { ArchiveChannelDialog } from '@/features/chat/archive-channel'
import { UnarchiveChannelDialog } from '@/features/chat/unarchive-channel'
import { DeleteChannelDialog } from '@/features/chat/delete-channel'
import { ChannelNotificationSettings } from '@/features/chat/set-conversation-notif-mode'

interface SettingsTabProps {
  conversation: ConversationFieldsFragment
}

// ── Action Row ─────────────────────────────────────────────────────────────────
interface ActionRowProps {
  label: string
  description: React.ReactNode
  action: React.ReactNode
  variant?: 'default' | 'danger' | 'warning' | 'success'
}

function ActionRow({ label, description, action, variant = 'default' }: ActionRowProps) {
  const borderClass = {
    default: 'border-subtle-1',
    danger:  'border-danger-strong',
    warning: 'border-warning-strong',
    success: 'border-success-strong',
  }[variant]

  const bgClass = {
    default: 'bg-transparent',
    danger:  'bg-danger-subtle',
    warning: 'bg-warning-subtle',
    success: 'bg-success-subtle',
  }[variant]

  return (
    <div
      className={`flex items-start justify-between gap-4 px-4 py-4 rounded-lg border transition-colors ${borderClass} ${bgClass}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-14 font-medium text-primary">{label}</p>
        <div className="text-11 text-secondary mt-0.5 leading-relaxed space-y-0.5">
          {description}
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
}

// ── Settings Tab ───────────────────────────────────────────────────────────────
export function SettingsTab({ conversation }: SettingsTabProps) {
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { close } = useChannelSettings()

  const isArchived = conversation.isArchived || false
  const workspaceId = conversation.workspaceId || ''
  const projectId = conversation.projectId || ''

  const handleDialogSuccess = () => {
    close()
  }

  return (
    <div className="space-y-6">

      {/* ── Channel management ── */}
      <section className="space-y-2.5">
        <p className="text-11 font-semibold uppercase tracking-widest text-tertiary px-1">
          Channel management
        </p>

        <div className="space-y-2">
          {/* Archive / Unarchive */}
          <Guard permission="chat:channel:archive">
            {!isArchived ? (
              <ActionRow
                label="Archive channel"
                description="The channel becomes read-only and hidden for all members."
                variant="warning"
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setArchiveDialogOpen(true)}
                    className="h-8 text-11 font-medium border-warning-subtle text-warning-primary hover:bg-warning-subtle border-subtle-1"
                  >
                    <Archive className="size-3.5 mr-1.5" />
                    Archive
                  </Button>
                }
              />
            ) : (
              <ActionRow
                label="Unarchive channel"
                description="Restore this channel so members can post messages again."
                variant="success"
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUnarchiveDialogOpen(true)}
                    className="h-8 text-11 font-medium border-success-subtle text-success-primary hover:bg-success-subtle border-subtle-1"
                  >
                    Unarchive
                  </Button>
                }
              />
            )}
          </Guard>

          {/* Delete */}
          <Guard permission="chat:channel:delete">
            <ActionRow
              label="Delete channel"
              description={
                <>
                  <span>Permanently remove this channel and all its messages.</span>
                  {!isArchived && (
                    <span className="block text-warning-primary font-medium">
                      Archive the channel first to enable deletion.
                    </span>
                  )}
                </>
              }
              variant="danger"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={!isArchived}
                  className="h-8 text-11 font-medium border-danger-subtle text-danger-primary hover:bg-danger-subtle disabled:text-disabled disabled:pointer-events-none"
                >
                  Delete
                </Button>
              }
            />
          </Guard>
        </div>
      </section>

      {/* ── Message permissions info ── */}
      <section className="space-y-2.5">
        <p className="text-11 font-semibold uppercase tracking-widest text-tertiary px-1">
          Message permissions
        </p>
        <div className="px-4 py-3.5 rounded-lg border-subtle-1 bg-layer-1">
          <p className="text-11 text-secondary leading-relaxed">
            All channel members can send messages. Use{' '}
            <span className="font-medium text-primary">Project Settings → Permissions</span>{' '}
            to control access via roles.
          </p>
        </div>
      </section>

      {/* ── Notification settings ── */}
      <section className="space-y-2.5">
        <ChannelNotificationSettings
          conversationId={conversation.id}
          initialMode={conversation.myNotifMode ?? undefined}
          initialMuteUntil={undefined}
        />
      </section>

      {/* ── Dialogs ── */}
      <ArchiveChannelDialog
        isOpen={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        channelId={conversation.id}
        channelName={conversation.name || 'this channel'}
        onSuccess={handleDialogSuccess}
      />

      <UnarchiveChannelDialog
        isOpen={unarchiveDialogOpen}
        onOpenChange={setUnarchiveDialogOpen}
        channelId={conversation.id}
        channelName={conversation.name || 'this channel'}
        workspaceId={workspaceId}
        projectId={projectId}
      />

      <DeleteChannelDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        channelId={conversation.id}
        channelName={conversation.name || 'this channel'}
        workspaceId={workspaceId}
        projectId={projectId}
        isArchived={isArchived}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}

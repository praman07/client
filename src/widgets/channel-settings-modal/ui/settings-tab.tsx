import { useState } from 'react'
import { ArchiveIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useChannelSettings } from '../hooks'
import type { ConversationFieldsFragment } from '@/gql/graphql'
import { Button } from '@/shared/ui/primitives/button'
import { Guard } from '@/shared/lib/auth'
import { ArchiveChannelDialog } from '@/features/chat/archive-channel'
import { UnarchiveChannelDialog } from '@/features/chat/unarchive-channel'
import { DeleteChannelDialog } from '@/features/chat/delete-channel'

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
    default: 'border-border/40',
    danger:  'border-destructive/20',
    warning: 'border-amber-500/20',
    success: 'border-emerald-500/20',
  }[variant]

  const bgClass = {
    default: 'bg-transparent',
    danger:  'bg-destructive/5',
    warning: 'bg-amber-500/5',
    success: 'bg-emerald-500/5',
  }[variant]

  return (
    <div
      className={`flex items-start justify-between gap-4 px-4 py-4 rounded-lg border transition-colors ${borderClass} ${bgClass}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed space-y-0.5">
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
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
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
                    className="h-8 text-xs font-medium border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50"
                  >
                    <HugeiconsIcon icon={ArchiveIcon} className="size-3.5 mr-1.5" />
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
                    className="h-8 text-xs font-medium border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50"
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
                    <span className="block text-amber-400/80 font-medium">
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
                  className="h-8 text-xs font-medium border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 disabled:opacity-40"
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
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
          Message permissions
        </p>
        <div className="px-4 py-3.5 rounded-lg border border-border/30 bg-muted/10">
          <p className="text-xs text-muted-foreground leading-relaxed">
            All channel members can send messages. Use{' '}
            <span className="font-medium text-foreground">Project Settings → Permissions</span>{' '}
            to control access via roles.
          </p>
        </div>
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

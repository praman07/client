import { useState } from 'react'
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react'
import { useChannelSettings } from '../hooks'
import type { ConversationFieldsFragment } from '@/gql/graphql'

import { Button } from '@/shared/ui/primitives/button'
import { Separator } from '@/shared/ui/primitives/separator'
import { ArchiveChannelDialog } from '@/features/chat/archive-channel'
import { UnarchiveChannelDialog } from '@/features/chat/unarchive-channel'
import { DeleteChannelDialog } from '@/features/chat/delete-channel'

interface SettingsTabProps {
  conversation: ConversationFieldsFragment
}

export function SettingsTab({ conversation }: SettingsTabProps) {
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { close } = useChannelSettings()

  const isArchived = conversation.isArchived || false
  const workspaceId = conversation.workspaceId || ''
  const projectId = conversation.projectId || ''

  const handleDialogSuccess = () => {
    // Close the settings modal after successful action
    close()
  }

  return (
    <div className="space-y-6">
      {/* Future settings sections can go here */}

      <Separator />

      {/* Danger Zone */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-destructive">
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground">
            Irreversible actions that affect this channel
          </p>
        </div>

        {/* Archive / Unarchive Button - Conditional */}
        {!isArchived && (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setArchiveDialogOpen(true)}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive Channel
            </Button>
          </div>
        )}

        {isArchived && (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start border-green-600/50 text-green-700 hover:bg-green-50 hover:text-green-700"
              onClick={() => setUnarchiveDialogOpen(true)}
            >
              <ArchiveRestore className="mr-2 h-4 w-4" />
              Unarchive Channel
            </Button>
            <p className="text-xs text-muted-foreground px-1">
              💡 Unarchive to restore this channel
            </p>
          </div>
        )}

        {/* Delete Channel Button */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className={
              isArchived
                ? 'w-full justify-start border-destructive/50 text-destructive hover:bg-destructive/10'
                : 'w-full justify-start text-muted-foreground border-muted-foreground/20'
            }
            onClick={() => setDeleteDialogOpen(true)}
            disabled={!isArchived}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Channel
          </Button>
          {!isArchived && (
            <p className="text-xs text-muted-foreground px-1">
              💡 Tip: Archive the channel first before deleting it
            </p>
          )}
        </div>
      </div>

      {/* Dialogs */}
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

import { useState } from 'react'
import { Button } from '@/shared/ui/primitives/button'
import { Label } from '@/shared/ui/primitives/label'
import { Separator } from '@/shared/ui/primitives/separator'
import {
  RenameChannelForm,
  extractChannelNames,
} from '@/features/chat/rename-channel'
import { useUserConversations, ConversationType } from '@/entities/conversation'
import { useChannelSettings } from '../hooks'
import type { Conversation, ConversationFieldsFragment } from '@/gql/graphql'
import { HugeiconsIcon } from '@hugeicons/react'
import { Edit02Icon } from '@hugeicons/core-free-icons'

interface AboutTabProps {
  conversation: ConversationFieldsFragment
}

export function AboutTab({ conversation }: AboutTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { close } = useChannelSettings()

  // Architecture: Reuse sidebar's channel query for validation without refetch
  // Strategy: staleTime=Infinity prevents refetch on mutation invalidation
  // Rationale: Validation list is static during modal session; backend validates as fallback
  const { data: channelsData } = useUserConversations(
    {
      workspaceId: conversation.workspaceId,
      projectId: conversation.projectId || undefined,
      type: ConversationType.Channel,
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  )

  const existingChannelNames = extractChannelNames(
    channelsData?.getUserConversations?.edges as Conversation[],
  )

  const handleSuccess = () => {
    setIsEditing(false)
    close()
  }

  return (
    <div className="space-y-6 p-1">
      {/* Channel Name Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Channel Name</Label>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8"
            >
              <HugeiconsIcon icon={Edit02Icon} className="size-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <RenameChannelForm
            channelId={conversation.id}
            currentName={conversation.name || ''}
            existingNames={existingChannelNames}
            onSuccess={handleSuccess}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="text-sm font-mono bg-muted px-3 py-2 rounded-md">
            #{conversation.name}
          </div>
        )}
      </div>

      <Separator />

      {/* Description Section */}
      <div className="space-y-2">
        <Label>Description</Label>
        <p className="text-sm text-muted-foreground">
          {conversation.description || 'No description'}
        </p>
      </div>

      <Separator />

      {/* Metadata */}
      <div className="space-y-2">
        <Label>Channel Details</Label>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Type:</dt>
            <dd className="font-medium">
              {conversation.isPublic ? 'Public' : 'Private'}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Created:</dt>
            <dd className="font-medium">
              {new Date(conversation.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Members:</dt>
            <dd className="font-medium">{conversation.memberCount || 0}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

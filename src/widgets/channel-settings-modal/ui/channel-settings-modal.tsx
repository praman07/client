import { useChannelSettings } from '../hooks'
import { ChannelSettingsTabs } from './channel-settings-tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui'
import { useConversation } from '@/entities/conversation'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import type { ConversationFieldsFragment } from '@/gql/graphql'

export function ChannelSettingsModal() {
  const { isOpen, channelId, close } = useChannelSettings()

  // Fetch full conversation details with members
  const { data, isLoading } = useConversation(channelId || '', {
    enabled: !!channelId && isOpen,
  })

  const conversation = data?.getConversation as
    | ConversationFieldsFragment
    | undefined

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="w-[800px] h-[800px] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              `# ${conversation?.name || 'Channel Settings'}`
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 py-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            conversation && <ChannelSettingsTabs conversation={conversation} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

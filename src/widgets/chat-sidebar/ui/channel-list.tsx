import { Copy, Hash, Lock, Plus, Settings } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'
import type { ChannelItem } from '../model/types'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/primitives/sidebar'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/primitives/context-menu'
import { useCreateChannelModal } from '@/features/chat/create-channel'
import { useChannelSettings } from '@/widgets/channel-settings-modal'
import { Guard } from '@/shared/lib/auth'

interface ChannelListProps {
  channels: Array<ChannelItem>
}

export function ChannelList({ channels }: ChannelListProps) {
  const { conversationId } = useParams({ strict: false })
  const { open } = useCreateChannelModal()
  const { open: openSettings } = useChannelSettings()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Channels</SidebarGroupLabel>
      <Guard permission="chat:channel:create">
        <SidebarGroupAction title="Create Channel" onClick={open}>
          <Plus className="size-4" />
        </SidebarGroupAction>
      </Guard>
      <SidebarGroupContent>
        <SidebarMenu>
          {channels.map((channel) => (
            <ContextMenu key={channel.id}>
              <ContextMenuTrigger>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={conversationId === channel.id}
                    tooltip={channel.name}
                    render={
                      <Link
                        to="/workspace/$workspaceSlug/project/$projectSlug/chat/$conversationId"

                        params={(prev: any) => ({
                          ...prev,
                          conversationId: channel.id,
                        })}
                      />
                    }
                  >
                    {channel.type === 'private' ? (
                      <Lock className="size-4 shrink-0" />
                    ) : (
                      <Hash className="size-4 shrink-0" />
                    )}
                    <span>{channel.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => openSettings(channel.id)}
                >
                  <Settings className="size-4" />
                  View channel details
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(channel.id)
                  }
                >
                  <Copy className="size-4" />
                  Copy channel ID
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

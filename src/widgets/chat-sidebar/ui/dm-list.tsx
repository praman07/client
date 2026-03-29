import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { Link, useParams } from '@tanstack/react-router'
import type { DMItem, GroupItem } from '../model/types'
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { CreateDmDialog, useCreateDmModal } from '@/features/chat/create-dm'

interface DMListProps {
  items: Array<DMItem | GroupItem>
}

/**
 * DMList Component
 * Displays both direct messages and group conversations
 */
export function DMList({ items }: DMListProps) {
  const { conversationId } = useParams({ strict: false })
  const { open } = useCreateDmModal()

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
        <SidebarGroupAction title="New Message" onClick={open}>
          <HugeiconsIcon icon={PlusSignIcon} />
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((dm) => (
              <SidebarMenuItem key={dm.id}>
                <SidebarMenuButton
                  isActive={conversationId === dm.id}
                  tooltip={dm.name}
                  render={
                    <Link
                      to="/workspace/$workspaceSlug/project/$projectSlug/chat/$conversationId"
                       
                      params={(prev: any) => ({ ...prev, conversationId: dm.id })}
                    />
                  }
                >
                  <div className="relative flex items-center justify-center">
                    <Avatar className="h-6 w-6 rounded-md">
                      <AvatarImage
                        src={
                          'avatarUrl' in dm
                            ? (dm.avatarUrl ?? undefined)
                            : undefined
                        }
                        alt={dm.name}
                      />
                      <AvatarFallback className="rounded-md text-[10px]">
                        {dm.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {'status' in dm && (
                      <span
                        className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
                          dm.status === 'online'
                            ? 'bg-green-500'
                            : dm.status === 'away'
                              ? 'bg-yellow-500'
                              : 'bg-zinc-500'
                        }`}
                      />
                    )}
                  </div>
                  <span>{dm.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* CreateDmDialog mounted as sibling — opens via Redux modal state */}
      <CreateDmDialog />
    </>
  )
}

'use client'

import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/primitives/tabs'

interface UserProfilePanelTabsProps {
  defaultValue?: string
}

export function UserProfilePanelTabs({
  defaultValue = 'profile',
}: UserProfilePanelTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b border-subtle bg-transparent h-auto p-0">
        <TabsTrigger
          value="profile"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2.5 text-13 font-medium"
        >
          Profile
        </TabsTrigger>
        <TabsTrigger
          value="actions"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2.5 text-13 font-medium"
        >
          Actions
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

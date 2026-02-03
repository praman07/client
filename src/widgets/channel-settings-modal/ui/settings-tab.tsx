import type { ConversationFieldsFragment } from '@/gql/graphql'

interface SettingsTabProps {
  conversation: ConversationFieldsFragment
}

export function SettingsTab({ conversation }: SettingsTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p className="text-lg font-medium">Advanced Settings</p>
      <p className="text-sm mt-2">Coming soon</p>
      <p className="text-xs mt-1">Archive, delete, and privacy settings</p>
    </div>
  )
}

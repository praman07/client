import type { ConversationFieldsFragment } from '@/gql/graphql'

interface MembersTabProps {
  conversation: ConversationFieldsFragment
}

export function MembersTab({ conversation }: MembersTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p className="text-lg font-medium">Members Management</p>
      <p className="text-sm mt-2">Coming soon</p>
      <p className="text-xs mt-1">{conversation.memberCount || 0} members</p>
    </div>
  )
}

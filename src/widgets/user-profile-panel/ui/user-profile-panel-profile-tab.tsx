import { Calendar, Globe } from 'lucide-react'
import { TabsContent } from '@/shared/ui/primitives/tabs'

interface UserProfilePanelProfileTabProps {
  joinedAt?: Date
}

export function UserProfilePanelProfileTab({
  joinedAt,
}: UserProfilePanelProfileTabProps) {
  const formatJoinedDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  return (
    <TabsContent value="profile" className="p-6 space-y-4 mt-0">
      {/* Member Since */}
      {joinedAt && (
        <div className="space-y-1.5">
          <h3 className="text-13 font-medium text-secondary">Member Since</h3>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-secondary" />
            <p className="text-14 text-primary">
              Member since {formatJoinedDate(joinedAt)}
            </p>
          </div>
        </div>
      )}
    </TabsContent>
  )
}

'use client'

import { TabsContent } from '@/shared/ui/primitives/tabs'
import { Button } from '@/shared/ui/primitives'
import { Guard } from '@/shared/lib/auth/guard'
import { Send, Settings, UserMinus } from 'lucide-react'

interface UserProfilePanelActionsTabProps {
  userId: string
  projectId: string
  onSendDM: (userId: string) => void
  onChangeRole: () => void
  onRemoveFromProject: () => void
}

export function UserProfilePanelActionsTab({
  userId,
  projectId: _projectId,
  onSendDM,
  onChangeRole,
  onRemoveFromProject,
}: UserProfilePanelActionsTabProps) {
  return (
    <TabsContent value="actions" className="p-6 mt-0">
      <div className="space-y-3">
        {/* Send DM - Available to everyone */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => onSendDM(userId)}
        >
          <Send size={16} />
          Send Direct Message
        </Button>

        {/* Change Role - Project Admins only */}
        <Guard permission="project:member:role-update">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={onChangeRole}
          >
            <Settings size={16} />
            Change Role
          </Button>
        </Guard>

        {/* Remove from Project - Project Admins only */}
        <Guard permission="project:member:remove">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={onRemoveFromProject}
          >
            <UserMinus size={16} />
            Remove from Project
          </Button>
        </Guard>

        {/* Empty state if no actions visible */}
        <NoActionsEmptyState />
      </div>
    </TabsContent>
  )
}

function NoActionsEmptyState() {
  return (
    <p className="text-13 text-secondary text-center py-4">
      No actions available for you
    </p>
  )
}

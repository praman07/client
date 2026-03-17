import { AlertTriangle, Lock, Settings } from 'lucide-react'
import { GeneralTab } from './general-tab'
import { AccessTab } from './access-tab'
import { DangerZone } from './danger-zone'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/primitives/tabs'

interface BoardSettingsProps {
  boardId: string
  isOpen: boolean
  onClose: () => void
}

/**
 * Board settings modal with tabbed interface
 *
 * Tabs:
 * - General: Name, description
 * - Access: Lock/unlock
 * - Danger Zone: Archive, delete
 */
export function BoardSettings({
  boardId,
  isOpen,
  onClose,
}: BoardSettingsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Board Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="access">
              <Lock className="h-4 w-4 mr-2" />
              Access
            </TabsTrigger>
            <TabsTrigger value="danger">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <GeneralTab boardId={boardId} />
          </TabsContent>

          <TabsContent value="access" className="mt-6">
            <AccessTab boardId={boardId} />
          </TabsContent>

          <TabsContent value="danger" className="mt-6">
            <DangerZone boardId={boardId} onDeleted={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

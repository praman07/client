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
      <DialogContent className="max-w-2xl bg-surface-2 border border-subtle rounded-xl shadow-dialog">
        <DialogHeader className="border-b border-subtle pb-4 mb-4">
          <DialogTitle className="flex items-center gap-2 text-18 font-semibold text-primary tracking-tight">
            <Settings className="h-5 w-5 text-icon-secondary" />
            Board Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4 -mx-6 px-6 -mb-6 pb-6">
          <TabsList className="flex gap-1 border-b border-subtle">
            <TabsTrigger value="general" className="px-3 py-2 text-13 font-medium text-secondary border-b-2 border-transparent hover:text-primary transition-colors duration-100">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="access" className="px-3 py-2 text-13 font-medium text-secondary border-b-2 border-transparent hover:text-primary transition-colors duration-100">
              <Lock className="h-4 w-4 mr-2" />
              Access
            </TabsTrigger>
            <TabsTrigger value="danger" className="px-3 py-2 text-13 font-medium text-secondary border-b-2 border-transparent hover:text-primary transition-colors duration-100">
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

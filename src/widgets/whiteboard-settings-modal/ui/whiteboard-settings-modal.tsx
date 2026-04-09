import { GeneralTab } from './general-tab'
import { MembersTab } from './members-tab'
import { SettingsTab } from './settings-tab'
import type { Board } from '@/entities/whiteboard-board'
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
import { ScrollArea } from '@/shared/ui/primitives/scroll-area'
import { usePermission } from '@/shared/lib/auth/use-permission'

interface WhiteboardSettingsModalProps {
  board: Board
  isCreator: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Which tab to show first */
  defaultTab?: 'general' | 'members' | 'settings'
}

/**
 * Centralised 3-tab settings modal for a whiteboard board.
 *
 * Tab visibility is permission-gated:
 * - General  → always visible (read-only if no whiteboard:update)
 * - Members  → visible if whiteboard:collaborator:read (or add/remove)
 * - Settings → visible if whiteboard:archive or whiteboard:delete
 *
 * Layout: fixed height (min(580px, 90svh)), tab body scrolls via ScrollArea.
 * Switching tabs never causes modal height jumps.
 */
export function WhiteboardSettingsModal({
  board,
  isCreator,
  open,
  onOpenChange,
  defaultTab = 'general',
}: WhiteboardSettingsModalProps) {
  const close = () => onOpenChange(false)

  // Tab visibility permissions
  const canReadMembers = usePermission('whiteboard:collaborator:read')
  const canAddMembers = usePermission('whiteboard:collaborator:add')
  const canRemoveMembers = usePermission('whiteboard:collaborator:remove')
  const canArchive = usePermission('whiteboard:archive')
  const canDelete = usePermission('whiteboard:delete')

  const showMembersTab = canReadMembers || canAddMembers || canRemoveMembers
  const showSettingsTab = canArchive || canDelete

  // Resolve safe initial tab if defaultTab is hidden
  const resolvedDefault = (() => {
    if (defaultTab === 'members' && !showMembersTab) return 'general'
    if (defaultTab === 'settings' && !showSettingsTab) return 'general'
    return defaultTab
  })()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
       * Fixed-height column-flex container.
       * h-[min(580px,90svh)] prevents overflow on small screens.
       * overflow-hidden clips ScrollArea correctly.
       * gap-0 + p-0 let us control all internal spacing manually.
       */}
      <DialogContent className="sm:max-w-lg flex flex-col gap-0 p-0 h-[min(580px,90svh)] overflow-hidden">
        {/* ── Header ─────────────────────────── shrink-0 */}
        <DialogHeader className="shrink-0 px-6 pt-6 pb-0">
          <DialogTitle className="truncate">{board.title}</DialogTitle>
        </DialogHeader>

        {/* ── Tabs ───────────────────────────────────── */}
        <Tabs
          defaultValue={resolvedDefault}
          className="flex flex-col flex-1 min-h-0 mt-4"
        >
          {/* Tab strip — always visible, never scrolls */}
          <TabsList className="shrink-0 mx-6 grid grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="members" disabled={!showMembersTab}>
              Members
            </TabsTrigger>
            <TabsTrigger value="settings" disabled={!showSettingsTab}>
              Settings
            </TabsTrigger>
          </TabsList>

          {/*
           * Each TabsContent fills remaining height. ScrollArea handles
           * overflow — content scrolls, dialog never resizes.
           */}
          <TabsContent
            value="general"
            className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-6 py-4">
                <GeneralTab board={board} onClose={close} />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="members"
            className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-6 py-4">
                <MembersTab board={board} />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="settings"
            className="flex-1 min-h-0 mt-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-6 py-4">
                <SettingsTab board={board} isCreator={isCreator} onClose={close} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

import { useAppSelector, useAppDispatch } from '@/shared/hooks'
import { selectUploadSlots, uploadTrayActions } from '../model'
import { VaultUploadSlot } from './vault-upload-slot'
import { X } from 'lucide-react'

/**
 * Floating upload progress tray — fixed bottom-right, always mounted in VaultPage.
 * Reads Redux uploadTray slice; VaultExplorer dispatches into it.
 *
 * @layer Widgets
 */
export function VaultUploadTray() {
  const dispatch = useAppDispatch()
  const slots = useAppSelector(selectUploadSlots)

  if (slots.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-xl border bg-popover shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/40">
        <span className="text-sm font-medium">
          Uploading{' '}
          {slots.filter((s) => s.status !== 'done').length > 0
            ? `${slots.filter((s) => s.status !== 'done').length} file${slots.filter((s) => s.status !== 'done').length !== 1 ? 's' : ''}`
            : 'complete'}
        </span>
        <button
          onClick={() => dispatch(uploadTrayActions.clearCompleted())}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear completed uploads"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Slots */}
      <div className="max-h-64 overflow-y-auto divide-y divide-border">
        {slots.map((slot) => (
          <VaultUploadSlot
            key={slot.localId}
            slot={slot}
            onDismiss={() =>
              dispatch(uploadTrayActions.removeSlot(slot.localId))
            }
          />
        ))}
      </div>
    </div>
  )
}

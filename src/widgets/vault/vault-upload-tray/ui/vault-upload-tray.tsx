import { X } from 'lucide-react'
import { selectUploadSlots, uploadTrayActions } from '../model'
import { VaultUploadSlot } from './vault-upload-slot'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

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
    <div className="fixed bottom-4 right-4 w-80 rounded-xl border border-subtle bg-surface-2 shadow-overlay-100 overflow-hidden z-[var(--z-toast)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-subtle bg-layer-2">
        <span className="text-14 font-medium text-primary">
          Uploading{' '}
          {slots.filter((s) => s.status !== 'done').length > 0
            ? `${slots.filter((s) => s.status !== 'done').length} file${slots.filter((s) => s.status !== 'done').length !== 1 ? 's' : ''}`
            : 'complete'}
        </span>
        <button
          onClick={() => dispatch(uploadTrayActions.clearCompleted())}
          className="text-secondary hover:text-primary transition-colors"
          aria-label="Clear completed uploads"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Slots */}
      <div className="max-h-64 overflow-y-auto divide-y divide-border-subtle">
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

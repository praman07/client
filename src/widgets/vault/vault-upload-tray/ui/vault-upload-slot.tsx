import { X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import type { UploadSlot } from '@/features/vault/upload-file'

interface VaultUploadSlotProps {
  slot: UploadSlot
  onDismiss: () => void
}

/**
 * Single file row in the upload tray.
 * Shows: filename, progress bar, status icon.
 *
 * @layer Widgets
 */
export function VaultUploadSlot({ slot, onDismiss }: VaultUploadSlotProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Status icon */}
      <StatusIcon status={slot.status} />

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{slot.name}</p>
        {slot.status === 'uploading' && (
          <div className="mt-1 h-1 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${slot.progress}%` }}
            />
          </div>
        )}
        {slot.status === 'error' && (
          <p className="text-xs text-destructive mt-0.5 truncate">
            {slot.error}
          </p>
        )}
      </div>

      {/* Dismiss button — only for done/error */}
      {(slot.status === 'done' || slot.status === 'error') && (
        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: UploadSlot['status'] }) {
  switch (status) {
    case 'uploading':
    case 'confirming':
    case 'queued':
      return <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
    case 'done':
      return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
    case 'error':
      return <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
  }
}

/**
 * ChatAttachmentPreview.tsx
 * Staging strip shown inside the chat input BEFORE the message is sent.
 *
 * Renders a horizontal scroll row of pending attachments with:
 * - Thumbnail for images (from object URL, zero upload required for preview)
 * - File card (icon + name + size) for non-image types
 * - ✕ remove button per attachment
 * - Upload progress overlay per file (while eager upload is in progress)
 *
 * This component is ONLY for the pre-send staging area.
 * For rendering attachments inside delivered messages, see ChatAttachmentRenderer.
 *
 * @layer Features → chat/media/ui
 */

import { useEffect, useRef } from 'react'
import { Archive, FileCode, FileText, Film, Music, RefreshCw, X } from 'lucide-react'
import type { ChatAttachment } from '@/shared/contracts/chat/message'
import { cn } from '@/shared/lib/utils'
import { formatBytes } from '@/shared/lib/upload-limits'

// ── Extended type for staging (includes upload state) ─────────────────────────

export interface StagedAttachment extends ChatAttachment {
  /** Local object URL for image preview. Created via URL.createObjectURL(). */
  localPreviewUrl?: string
  /** Upload progress 0–100. undefined = upload done. */
  uploadProgress?: number
  /**
   * True if the upload attempt failed.
   * The card shows a retry button instead of a progress bar.
   * The original File is stored in `file` so retry can re-use it.
   */
  failed?: boolean
  /** Original File object — kept for retry on failure. Not persisted. */
  file?: File
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ChatAttachmentPreviewProps {
  attachments: Array<StagedAttachment>
  onRemove: (fileId: string) => void
  onRetry: (fileId: string) => void
  className?: string
}

// ── File type icons (Lucide — consistent with rest of project) ────────────────

function FileTypeIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  if (mimeType.startsWith('video/')) return <Film className={cn('text-blue-400', className)} />
  if (mimeType.startsWith('audio/')) return <Music className={cn('text-purple-400', className)} />
  if (mimeType === 'application/pdf') return <FileText className={cn('text-red-400', className)} />
  if (mimeType.startsWith('text/') || mimeType === 'application/json') {
    return <FileCode className={cn('text-green-400', className)} />
  }
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('gzip')) {
    return <Archive className={cn('text-yellow-500', className)} />
  }
  return <FileText className={cn('text-muted-foreground', className)} />
}

// ── Single attachment preview card ────────────────────────────────────────────

function AttachmentCard({
  attachment,
  onRemove,
  onRetry,
}: {
  attachment: StagedAttachment
  onRemove: () => void
  onRetry: () => void
}) {
  const isImage = attachment.mimeType.startsWith('image/')
  const isUploading = attachment.uploadProgress !== undefined && attachment.uploadProgress < 100
  const isFailed = attachment.failed === true

  // Revoke object URL when card unmounts to avoid memory leaks.
  // Capture the value inside the effect so the cleanup closes over it —
  // avoids the react-hooks/exhaustive-deps warning about stale ref values.
  const localUrlRef = useRef(attachment.localPreviewUrl)
  useEffect(() => {
    const localUrl = localUrlRef.current
    return () => {
      if (localUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(localUrl)
      }
    }
  }, [])

  return (
    <div className="relative shrink-0 group/card">
      {/* Card body */}
      <div
        className={cn(
          'relative flex items-center overflow-hidden rounded-lg border border-border/60 bg-card',
          isImage ? 'w-16 h-16' : 'h-12 max-w-[140px] px-2 gap-2',
        )}
        title={`${attachment.name} (${formatBytes(attachment.sizeBytes)})`}
      >
        {isImage && attachment.localPreviewUrl ? (
          // Image thumbnail
          <img
            src={attachment.localPreviewUrl}
            alt={attachment.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : isImage ? (
          // Image but no local preview yet
          <div className="w-full h-full flex items-center justify-center bg-card">
            <Film className="size-5 text-muted-foreground" />
          </div>
        ) : (
          // Non-image file card
          <>
            <FileTypeIcon mimeType={attachment.mimeType} className="size-4 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate leading-tight">
                {attachment.name}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                {formatBytes(attachment.sizeBytes)}
              </span>
            </div>
          </>
        )}

        {/* Upload progress overlay */}
        {isUploading && (
          <div
            className="absolute inset-0 flex items-end bg-black/30 rounded-lg"
            aria-label={`Uploading ${attachment.uploadProgress}%`}
          >
            <div
              className="h-1.5 bg-primary transition-all duration-150 rounded-b-lg"
              style={{ width: `${attachment.uploadProgress}%` }}
            />
          </div>
        )}

        {/* Failed overlay — shows retry affordance */}
        {isFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/20 rounded-lg">
            <button
              onClick={(e) => { e.stopPropagation(); onRetry() }}
              className="flex items-center justify-center size-6 rounded-full bg-background/90 border border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
              title="Retry upload"
              aria-label={`Retry uploading ${attachment.name}`}
            >
              <RefreshCw className="size-3" />
            </button>
          </div>
        )}
      </div>

      {/* Remove button — always visible on hover; always shown when done or failed */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className={cn(
          'absolute -top-1.5 -right-1.5 size-4 rounded-full bg-background border border-border',
          'flex items-center justify-center shadow-sm',
          'text-muted-foreground hover:text-destructive hover:border-destructive transition-colors',
          'opacity-0 group-hover/card:opacity-100',
          (!isUploading || isFailed) && 'opacity-100',
        )}
        aria-label={`Remove ${attachment.name}`}
        title={`Remove ${attachment.name}`}
      >
        <X className="size-2.5" />
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ChatAttachmentPreview({
  attachments,
  onRemove,
  onRetry,
  className,
}: ChatAttachmentPreviewProps) {
  if (attachments.length === 0) return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-3 border-border/50 overflow-x-auto scrollbar-none',
        className,
      )}
      role="list"
      aria-label={`${attachments.length} pending attachment${attachments.length === 1 ? '' : 's'}`}
    >
      {attachments.map((attachment) => (
        <div
          key={attachment.fileId}
          role="listitem"
          className="animate-in fade-in-0 slide-in-from-bottom-1 duration-150"
        >
          <AttachmentCard
            attachment={attachment}
            onRemove={() => onRemove(attachment.fileId)}
            onRetry={() => onRetry(attachment.fileId)}
          />
        </div>
      ))}
    </div>
  )
}

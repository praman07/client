/**
 * ChatAttachmentPicker.tsx
 * A pure file selector button for the chat input toolbar.
 *
 * Responsibility: open the system file dialog → call onFileSelected(file).
 * It does NOT upload. The parent (MessageInput) owns the upload lifecycle
 * via startUpload(), which fetches the token and manages progress state.
 *
 * @layer Features → chat/media/ui
 */

import { useRef } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Attachment01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/shared/ui/primitives/button'
import { cn } from '@/shared/lib/utils'
import { VAULT_ALLOWED_MIME_TYPES } from '@/features/vault/upload-file'
import { CHAT_MAX_ATTACHMENTS } from '@/shared/lib/upload-limits'

// ── Props ─────────────────────────────────────────────────────────────────────

interface ChatAttachmentPickerProps {
  /** How many attachments are already staged — used to enforce the cap. */
  currentAttachmentCount: number
  /** Called when the user selects a file. Parent is responsible for upload. */
  onFileSelected: (file: File) => void
  /** True while any upload is in progress — disables the button. */
  uploading?: boolean
  disabled?: boolean
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ChatAttachmentPicker({
  currentAttachmentCount,
  onFileSelected,
  uploading = false,
  disabled = false,
  className,
}: ChatAttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const isAtCap = currentAttachmentCount >= CHAT_MAX_ATTACHMENTS
  const isDisabled = disabled || uploading || isAtCap

  const handleClick = () => {
    if (isDisabled) return
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Reset so the same file can be re-selected after removal
    if (inputRef.current) inputRef.current.value = ''
    if (!file) return
    onFileSelected(file)
  }

  const tooltipText = isAtCap
    ? `Maximum ${CHAT_MAX_ATTACHMENTS} attachments per message`
    : uploading
      ? 'Upload in progress…'
      : 'Attach a file (max 50 MB). For larger files, use the Vault.'

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={Array.from(VAULT_ALLOWED_MIME_TYPES).join(',')}
        onChange={handleFileChange}
        aria-hidden="true"
      />
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'size-7 text-secondary hover:text-primary',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        onClick={handleClick}
        disabled={isDisabled}
        title={tooltipText}
        aria-label="Attach file"
      >
        <HugeiconsIcon icon={Attachment01Icon} className="size-4" />
      </Button>
    </>
  )
}

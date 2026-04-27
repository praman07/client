/**
 * InlineEditBox — rich inline editor used by PrimaryMessage / AdditionalMessage
 * when a message enters edit mode.
 *
 * Feature parity with MessageInput:
 *   - @-mention trigger + chip rendering (via ChatMentionTrigger)
 *   - Auto-resize textarea
 *   - Keyboard: Enter saves, Escape cancels, ↑↓ navigates mention menu
 *   - Paste: text-only (image paste is silently ignored — matching Slack/Linear)
 *   - Mention prune at save-time: stale mention refs are removed before emit
 *
 * Edge cases handled:
 *   EC-1/2  User deletes/edits a mention token → pruned at save
 *   EC-3    New mention added via trigger → works identically to MessageInput
 *   EC-4    Content cleared → Save disabled
 *   EC-5    Content unchanged → no WS event emitted (hook no-ops)
 *   EC-6    Plain (no-mention) message → plain path, no JSON overhead
 *   EC-7    Paste image → silently ignored
 *   EC-8    Escape / Cancel button → onCancel()
 *   EC-10   @query typed but menu closed without selection → stays as plain text
 *
 * @layer Widgets → chat-window/ui/components
 */
import { AtSign } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChatMentionTrigger } from '@/features/mention'
import { ChatToolbarTextarea } from './chat-layout'
import { parseContent } from './RichChatContent'
import type { MentionRef } from './RichChatContent'
import { Button } from '@/shared/ui/primitives/button'
import { cn } from '@/shared/lib/utils'

// ── Props ─────────────────────────────────────────────────────────────────────

export interface InlineEditBoxProps {
  /** Raw message.content — may be JSON string `{ text, mentions }` or plain string */
  initialContent: unknown
  projectId: string
  onSave: (richContent: string) => void
  onCancel: () => void
  className?: string
}

// ── Mention prune ─────────────────────────────────────────────────────────────

/**
 * Walk the mentions array and remove any whose @token no longer appears at
 * its recorded offset in `text`. This handles EC-1/EC-2: user manually edited
 * or deleted a mention token while in the textarea.
 *
 * Returns a fresh mentions array with corrected entries only.
 */
function pruneStaleMentions(text: string, mentions: Array<MentionRef>): Array<MentionRef> {
  return mentions.filter((m) => {
    const expected = `@${m.displayText}`
    return text.slice(m.offset, m.offset + expected.length) === expected
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export function InlineEditBox({
  initialContent,
  projectId,
  onSave,
  onCancel,
  className,
}: InlineEditBoxProps) {
  // ── Parse initial content ──────────────────────────────────────────────────
  const parsed = parseContent(initialContent)
  const initialText     = 'rich' in parsed ? parsed.rich.text     : parsed.plain
  const initialMentions = 'rich' in parsed ? parsed.rich.mentions : []

  // ── State ──────────────────────────────────────────────────────────────────
  const [content,          setContent]          = useState(initialText)
  const [mentions,         setMentions]         = useState<Array<MentionRef>>(initialMentions)
  const [isMentionMenuOpen, setIsMentionMenuOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus when edit mode opens
  useEffect(() => {
    textareaRef.current?.focus()
    // Place caret at end of text
    const len = textareaRef.current?.value.length ?? 0
    textareaRef.current?.setSelectionRange(len, len)
  }, [])

  // Auto-resize textarea
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  // ── Serialize & save ──────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    const trimmedText = content.trim()
    if (!trimmedText) return  // EC-4: empty content — no-op

    // EC-1/EC-2: Prune mentions whose tokens no longer exist at their offsets
    const validMentions = pruneStaleMentions(trimmedText, mentions)

    // EC-6: Only wrap in JSON when there are valid mentions
    const richContent = validMentions.length > 0
      ? JSON.stringify({ text: trimmedText, mentions: validMentions })
      : trimmedText

    onSave(richContent)
  }, [content, mentions, onSave])

  // ── Keyboard handler ──────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // 1. Let the mention menu consume the event first
      if (ChatMentionTrigger._keyHandler?.(e)) return

      // 2. Escape cancels edit
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
        return
      }

      // 3. Enter saves — but NOT while the mention menu is open
      if (e.key === 'Enter' && !e.shiftKey && !isMentionMenuOpen) {
        e.preventDefault()
        handleSave()
      }
    },
    [handleSave, onCancel, isMentionMenuOpen],
  )

  // ── Paste — text only, silently ignore images (EC-7) ──────────────────────

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Only block if there are files — let plain-text paste fall through naturally
    if (e.nativeEvent.clipboardData?.files?.length) {
      e.preventDefault()  // silently ignore image/file paste in edit mode
    }
  }, [])

  // ── Derived ───────────────────────────────────────────────────────────────

  const canSave = content.trim().length > 0

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={cn('flex flex-col gap-1.5 mt-1', className)} data-inline-edit-box>

      {/* Mention trigger — positioned relative to this container */}
      <div className="relative">
        <ChatMentionTrigger
          projectId={projectId}
          content={content}
          onContentChange={setContent}
          mentions={mentions}
          onMentionsChange={setMentions}
          inputRef={textareaRef}
          onMenuOpen={setIsMentionMenuOpen}
        />

        {/* Textarea */}
        <ChatToolbarTextarea
          ref={textareaRef}
          value={content}
          className={cn(
            'w-full rounded-md border border-subtle-1 bg-layer-2 px-3 py-2 text-14',
            'min-h-[60px] max-h-[240px] overflow-y-auto resize-none',
            'focus:outline-none focus:ring-1 focus:ring-accent-subtle',
          )}
          onChange={(e) => {
            setContent(e.target.value)
            requestAnimationFrame(() => ChatMentionTrigger._checkTrigger?.())
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between">
        {/* Left: hint + mention shortcut */}
        <div className="flex items-center gap-2">
          <p className="text-11 text-secondary">
            <span className="font-medium">escape</span> to cancel
            {' '}•{' '}
            <span className="font-medium">enter</span> to save
          </p>
          {/* @-mention shortcut button */}
          <button
            type="button"
            aria-label="Mention"
            className="size-5 inline-flex items-center justify-center rounded text-secondary hover:text-primary hover:bg-accent-subtle transition-colors"
            onClick={() => {
              const textarea = textareaRef.current
              if (!textarea) return
              const pos = textarea.selectionStart ?? textarea.value.length
              const before = content.slice(0, pos)
              const after  = content.slice(pos)
              const needsSpace = before.length > 0 && !/\s$/.test(before)
              const insertion  = needsSpace ? ' @' : '@'
              setContent(before + insertion + after)
              setTimeout(() => {
                textarea.focus()
                const nextPos = pos + insertion.length
                textarea.setSelectionRange(nextPos, nextPos)
                requestAnimationFrame(() => ChatMentionTrigger._checkTrigger?.())
              }, 0)
            }}
          >
            <AtSign className="size-3" />
          </button>
        </div>

        {/* Right: Cancel + Save */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2.5 text-11"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-6 px-2.5 text-11 rounded-full font-semibold uppercase tracking-wide"
            disabled={!canSave}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

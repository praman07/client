import { useRef, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useRenamePage } from '../hooks/use-rename-page'
import { mapRenamePageError } from '../lib/error-mapping'
import { renamePageSchema, validateZod } from '../model/schema'

export interface RenamePageInputProps {
  pageId: string
  projectId: string
  currentTitle: string
  /** Called when editing is committed or cancelled */
  onDone?: () => void
  className?: string
}

/**
 * Inline TanStack Form input for renaming a page.
 *
 * UX:
 *  - autoFocused on mount, full text selected
 *  - Enter / blur  → form.handleSubmit() (validates then mutates)
 *  - Escape        → cancel without submitting, call onDone
 *  - Empty title   → inline field validation error, no network request
 *  - isPending     → input disabled
 *  - Error         → toast + onDone (optimistic rollback handled by hook)
 *
 * @layer Features
 */
export function RenamePageInput({
  pageId,
  projectId,
  currentTitle,
  onDone,
  className,
}: RenamePageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: renamePage, isPending } = useRenamePage()

  // Auto-focus and select all text on mount
  useEffect(() => {
    inputRef.current?.select()
  }, [])

  const form = useForm({
    defaultValues: {
      title: currentTitle,
    },
    onSubmit: async ({ value }) => {
      const trimmed = value.title.trim()

      // No change — skip network call
      if (trimmed === currentTitle) {
        onDone?.()
        return
      }

      try {
        await renamePage({ pageId, projectId, title: trimmed })
        onDone?.()
      } catch (error: unknown) {
        const message = mapRenamePageError(error)
        toast.error(message)
        // Restore original value (optimistic rollback handled by hook)
        form.reset()
        onDone?.()
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="title"
        validators={{
          onChange: validateZod(renamePageSchema.shape.title),
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <input
              ref={inputRef}
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={() => {
                const trimmed = field.state.value.trim()
                if (trimmed !== field.state.value) {
                  field.handleChange(trimmed)
                }
                field.handleBlur()
                form.handleSubmit()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  form.handleSubmit()
                } else if (e.key === 'Escape') {
                  e.preventDefault()
                  form.reset()
                  onDone?.()
                }
              }}
              disabled={isPending}
              maxLength={500}
              aria-label="Page title"
              className={className}
            />
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <p className="text-xs text-destructive">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
          </div>
        )}
      </form.Field>
    </form>
  )
}

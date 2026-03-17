import { useEffect, useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Check, X } from 'lucide-react'
import { useRenameBoard } from '../hooks'
import { renameBoardSchema } from '../model'
import { mapRenameBoardError } from '../lib'
import { Input } from '@/shared/ui/primitives/input'

interface RenameBoardInputProps {
  boardId: string
  initialTitle: string
  onSuccess?: (newTitle: string) => void
  onCancel?: () => void
}

/**
 * Inline editable input for renaming boards
 *
 * Pattern: Click to edit, Escape to cancel, Enter/Blur to save
 * Features: Optimistic updates, validation, error handling
 */
export function RenameBoardInput({
  boardId,
  initialTitle,
  onSuccess,
  onCancel,
}: RenameBoardInputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: renameBoard, isPending } = useRenameBoard()

  const form = useForm({
    defaultValues: {
      boardId,
      title: initialTitle,
    },
    onSubmit: async ({ value }) => {
      // Don't submit if title unchanged
      if (value.title.trim() === initialTitle.trim()) {
        setIsEditing(false)
        return
      }

      try {
        await renameBoard(value)
        toast.success('Board renamed successfully')
        setIsEditing(false)
        onSuccess?.(value.title)
      } catch (error: any) {
        const message = mapRenameBoardError(error)
        toast.error(message)
        // Keep editing on error so user can fix
      }
    },
  })

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  if (!isEditing) {
    return (
      <h1
        className="cursor-pointer text-2xl font-bold hover:text-primary"
        onClick={() => setIsEditing(true)}
        title="Click to rename"
      >
        {form.state.values.title}
      </h1>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex items-center gap-2"
    >
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => {
            const result = renameBoardSchema.shape.title.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="flex-1">
            <Input
              ref={inputRef}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={() => {
                // Trim on blur
                const trimmed = field.state.value.trim()
                if (trimmed !== field.state.value) {
                  field.handleChange(trimmed)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  field.handleChange(initialTitle)
                  setIsEditing(false)
                  onCancel?.()
                }
                if (e.key === 'Enter') {
                  form.handleSubmit()
                }
              }}
              disabled={isPending}
              className="text-2xl font-bold"
              aria-label="Board title"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex gap-1">
        <button
          type="submit"
          disabled={isPending || form.state.errors.length > 0}
          className="rounded-md p-1 hover:bg-accent disabled:opacity-50"
          title="Save (Enter)"
        >
          <Check className="h-5 w-5 text-green-600" />
        </button>
        <button
          type="button"
          onClick={() => {
            form.setFieldValue('title', initialTitle)
            setIsEditing(false)
            onCancel?.()
          }}
          disabled={isPending}
          className="rounded-md p-1 hover:bg-accent disabled:opacity-50"
          title="Cancel (Esc)"
        >
          <X className="h-5 w-5 text-destructive" />
        </button>
      </div>
    </form>
  )
}

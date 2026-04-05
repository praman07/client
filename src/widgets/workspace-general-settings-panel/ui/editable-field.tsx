import { useState, useRef, useEffect } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Input } from '@/shared/ui/primitives/input'
import { cn } from '@/shared/lib/utils'

interface EditableFieldProps {
  id?: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string | null
  disabled?: boolean
}

/**
 * View → Edit mode field.
 *
 * Idle:    [Value text] [✏ pencil — visible on hover]
 * Editing: [Input] [✓] [✗]
 *
 * On ✗ / Escape → reverts to last committed value.
 * On ✓ / Enter → commits edit, calls onChange.
 */
export function EditableField({
  id,
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  disabled = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep draft in sync when parent value changes (e.g. form reset)
  useEffect(() => {
    if (!isEditing) setDraft(value)
  }, [value, isEditing])

  const enterEdit = () => {
    if (disabled) return
    setDraft(value)
    setIsEditing(true)
    // Focus after render
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const commit = () => {
    onChange(draft)
    onBlur?.()
    setIsEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { e.preventDefault(); cancel() }
  }

  if (isEditing) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            id={id}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="h-10 flex-1"
          />
          <button
            type="button"
            onClick={commit}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Confirm"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={cancel}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input hover:bg-muted transition-colors text-muted-foreground"
            title="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        id={id}
        onClick={enterEdit}
        disabled={disabled}
        className={cn(
          'group flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm text-left',
          'hover:border-primary/50 hover:bg-muted/30 transition-colors',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        title="Click to edit"
      >
        <span className={cn(!value && 'text-muted-foreground italic')}>
          {value || placeholder || '—'}
        </span>
        {!disabled && (
          <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
        )}
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

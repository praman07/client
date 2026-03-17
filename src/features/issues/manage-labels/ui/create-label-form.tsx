/**
 * CreateLabelForm — Inline TanStack Form for adding a new project label.
 *
 * Fields: name (required) + color (hex, defaults to #6B7280)
 * Submit → useCreateLabel → onSuccess callback
 * Cancel → onCancel callback
 *
 * @layer Features
 */
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useCreateLabel } from '../hooks'
import { mapLabelError } from '../lib/error-mapping'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'

interface CreateLabelFormProps {
  projectId: string
  onSuccess?: () => void
  onCancel?: () => void
}

const COLOR_PRESETS = [
  '#6B7280',
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
]

export function CreateLabelForm({
  projectId,
  onSuccess,
  onCancel,
}: CreateLabelFormProps) {
  const { mutateAsync: createLabel, isPending } = useCreateLabel()

  const form = useForm({
    defaultValues: { name: '', color: '#6B7280' },
    onSubmit: async ({ value }) => {
      try {
        await createLabel({
          projectId,
          name: value.name.trim(),
          color: value.color,
        })
        toast.success('Label created')
        form.reset()
        onSuccess?.()
      } catch (error) {
        toast.error(mapLabelError(error))
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
      className="space-y-3 pt-2"
    >
      {/* Name */}
      <form.Field name="name">
        {(field) => (
          <div className="space-y-1">
            <Label htmlFor={field.name} className="text-xs">
              Label name <span className="text-destructive">*</span>
            </Label>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. Bug, Feature, Priority"
              className="h-8"
              autoFocus
              onKeyDown={(e) => e.key === 'Escape' && onCancel?.()}
            />
          </div>
        )}
      </form.Field>

      {/* Color */}
      <form.Field name="color">
        {(field) => (
          <div className="space-y-1">
            <Label className="text-xs">Color</Label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {COLOR_PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className="h-5 w-5 rounded-full ring-offset-background transition-transform hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: hex }}
                  aria-label={hex}
                  onClick={() => field.handleChange(hex)}
                >
                  {field.state.value === hex && (
                    <span className="flex h-full w-full items-center justify-center text-[10px] text-white">
                      ✓
                    </span>
                  )}
                </button>
              ))}
              <input
                type="color"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-5 w-5 cursor-pointer rounded-full border-0 bg-transparent p-0"
                title="Custom color"
              />
            </div>
          </div>
        )}
      </form.Field>

      {/* Footer */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Adding…' : 'Add label'}
        </Button>
      </div>
    </form>
  )
}

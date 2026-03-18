import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { useRenameChannel } from '../hooks'
import { renameChannelSchema, sanitizeChannelName } from '../model/schema'
import { mapRenameChannelError } from '../lib/error-mapping'
import { Input } from '@/shared/ui/primitives/input'
import { Button } from '@/shared/ui/primitives/button'

interface RenameChannelFormProps {
  channelId: string
  currentName: string
  existingNames: Array<string>
  onSuccess?: () => void
  onCancel?: () => void
}

export function RenameChannelForm({
  channelId,
  currentName,
  existingNames,
  onSuccess,
  onCancel,
}: RenameChannelFormProps) {
  const { mutateAsync: renameChannel, isPending } = useRenameChannel()

  const form = useForm({
    defaultValues: {
      name: currentName,
    },
    onSubmit: async ({ value }) => {
      try {
        await renameChannel({
          channelId,
          name: value.name,
        })
        toast.success('Channel renamed successfully')
        onSuccess?.()
      } catch (error: any) {
        const errorMessage = mapRenameChannelError(error)
        toast.error(errorMessage)
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
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }: { value: string }) => {
            // Zod validation for format
            const result = renameChannelSchema.shape.name.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
          onChangeAsync: ({ value }: { value: string }) => {
            // Skip if name hasn't changed
            if (value === currentName) return null

            // Check for duplicates
            if (existingNames.includes(value)) {
              return 'A channel with this name already exists'
            }
            return null
          },
          onChangeAsyncDebounceMs: 300,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={() => {
                // Trim leading/trailing dashes after user finishes typing
                const trimmed = field.state.value.replace(/^-+|-+$/g, '')
                if (trimmed !== field.state.value) {
                  field.handleChange(trimmed)
                }
                field.handleBlur()
              }}
              onChange={(e) => {
                // Sanitize in real-time: spaces → dashes, lowercase, remove invalid chars
                field.handleChange(sanitizeChannelName(e.target.value))
              }}
              placeholder="channel-name"
              disabled={isPending}
              autoFocus
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4 mr-2" />
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <Button type="submit" size="sm" disabled={!canSubmit || isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}

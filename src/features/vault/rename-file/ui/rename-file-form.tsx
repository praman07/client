import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useRenameFile } from '../hooks/use-rename-file'
import { renameSchema } from '../model/schema'
import { mapRenameFileError } from '../lib/error-mapping'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'

interface RenameFileFormProps {
  fileId: string
  projectId: string
  folderId: string | null
  /** Pre-fills the input with the existing file name */
  currentName: string
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * TanStack Form for renaming a vault file.
 * Pre-fills with currentName. Sync Zod validation on change.
 *
 * @layer Features
 */
export function RenameFileForm({
  fileId,
  projectId,
  folderId,
  currentName,
  onSuccess,
  onCancel,
}: RenameFileFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: renameFile, isPending } = useRenameFile()

  const form = useForm({
    defaultValues: {
      name: currentName,
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        await renameFile({
          fileId,
          projectId,
          folderId,
          name: value.name.trim(),
        })
        toast.success('File renamed')
        onSuccess?.()
      } catch (error: unknown) {
        const message = mapRenameFileError(error)
        setRootError(message)
        toast.error(message)
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
      {rootError && (
        <div className="rounded-md bg-danger-subtle px-3 py-2 text-13 text-danger-primary">
          {rootError}
        </div>
      )}

      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            const result = renameSchema.shape.name.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>File name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isPending}
              autoFocus
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-13 text-danger-primary">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit || isPending}>
              {isPending ? 'Renaming...' : 'Rename'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}

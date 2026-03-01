import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { useCreateFolder } from '../hooks/use-create-folder'
import { createFolderSchema } from '../model/schema'
import { mapCreateFolderError } from '../lib/error-mapping'

interface CreateFolderFormProps {
  projectId: string
  /** null = create at root level */
  parentFolderId: string | null
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * TanStack Form for creating a new vault folder.
 * Sync Zod validation on the name field.
 * Mount inside CreateFolderModal or use standalone.
 *
 * @layer Features
 */
export function CreateFolderForm({
  projectId,
  parentFolderId,
  onSuccess,
  onCancel,
}: CreateFolderFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: createFolder, isPending } = useCreateFolder()

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        await createFolder({
          projectId,
          name: value.name.trim(),
          parentFolderId,
        })
        toast.success('Folder created')
        onSuccess?.()
      } catch (error: unknown) {
        const message = mapCreateFolderError(error)
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
      {/* Root-level server error */}
      {rootError && (
        <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
          {rootError}
        </div>
      )}

      {/* Name field */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            const result = createFolderSchema.shape.name.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Folder name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. Designs, Assets, Documents"
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

      {/* Actions */}
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
              {isPending ? 'Creating...' : 'Create folder'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}

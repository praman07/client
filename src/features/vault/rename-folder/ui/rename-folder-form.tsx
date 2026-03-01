import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { useRenameFolder } from '../hooks/use-rename-folder'
import { renameSchema } from '../model/schema'
import { mapRenameFolderError } from '../lib/error-mapping'

interface RenameFolderFormProps {
  folderId: string
  projectId: string
  parentFolderId: string | null
  /** Pre-fills the input with the existing folder name */
  currentName: string
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * TanStack Form for renaming a vault folder.
 * Pre-fills with currentName. Sync Zod validation on change.
 *
 * @layer Features
 */
export function RenameFolderForm({
  folderId,
  projectId,
  parentFolderId,
  currentName,
  onSuccess,
  onCancel,
}: RenameFolderFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: renameFolder, isPending } = useRenameFolder()

  const form = useForm({
    defaultValues: {
      name: currentName,
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        await renameFolder({
          folderId,
          projectId,
          parentFolderId,
          name: value.name.trim(),
        })
        toast.success('Folder renamed')
        onSuccess?.()
      } catch (error: unknown) {
        const message = mapRenameFolderError(error)
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
        <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
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
            <Label htmlFor={field.name}>Folder name</Label>
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
              <p className="text-sm text-destructive">
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

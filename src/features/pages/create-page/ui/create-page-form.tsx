import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useCreatePage } from '../hooks/use-create-page'
import { mapCreatePageError } from '../lib/error-mapping'
import { createPageSchema, validateZod } from '../model/schema'
import { CollaboratorPicker } from './collaborator-picker'
import type { Page } from '@/entities/page'
import { useAuth } from '@/shared/hooks'
import { Label } from '@/shared/ui/primitives/label'
import { Input } from '@/shared/ui/primitives/input'
import { Button } from '@/shared/ui/primitives/button'

export interface CreatePageFormProps {
  workspaceId: string
  projectId: string
  /** null = root-level page; string cuid = create as child of this page */
  parentId?: string | null
  /** Fractional index position — pre-computed by caller */
  position: number
  onSuccess?: (page: Page) => void
  onCancel?: () => void
}

/** Row component to display field validation errors */
function FieldError({ field }: { field: any }) {
  if (!field.state.meta.isTouched || !field.state.meta.errors.length)
    return null
  return (
    <p className="text-sm font-medium text-destructive">
      {field.state.meta.errors.join(', ')}
    </p>
  )
}

/**
 * TanStack Form component for creating a new page.
 *
 * Caller supplies workspaceId, projectId, parentId, and position.
 * Form exposes only title and icon to the user.
 *
 * @layer Features
 */
export function CreatePageForm({
  workspaceId,
  projectId,
  parentId = null,
  position,
  onSuccess,
  onCancel,
}: CreatePageFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: createPage, isPending } = useCreatePage()
  const { userId } = useAuth()

  const form = useForm({
    defaultValues: {
      title: '',
      icon: '',
      collaboratorIds: userId ? [userId] : ([] as Array<string>),
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        const result = await createPage({
          workspaceId,
          projectId,
          parentId,
          position,
          title: value.title || 'Untitled',
          icon: value.icon || undefined,
          collaboratorIds: value.collaboratorIds,
        })
        toast.success('Page created')
        onSuccess?.(result.createPage.page as Page)
      } catch (error: unknown) {
        const message = mapCreatePageError(error)
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
      {/* Root error */}
      {rootError && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
          {rootError}
        </div>
      )}

      {/* Title */}
      <form.Field
        name="title"
        validators={{
          onChange: validateZod(createPageSchema.shape.title),
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Page Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={() => {
                const trimmed = field.state.value.trim()
                if (trimmed !== field.state.value) field.handleChange(trimmed)
                field.handleBlur()
              }}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Untitled"
              autoFocus
              disabled={isPending}
            />
            <FieldError field={field} />
          </div>
        )}
      </form.Field>

      {/* Icon */}
      <form.Field
        name="icon"
        validators={{
          onChange: validateZod(createPageSchema.shape.icon),
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              Icon <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="📄"
              maxLength={10}
              disabled={isPending}
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Paste an emoji to set a page icon.
            </p>
            <FieldError field={field} />
          </div>
        )}
      </form.Field>

      {/* Collaborators */}
      <form.Field name="collaboratorIds">
        {(field) => (
          <CollaboratorPicker
            workspaceId={workspaceId}
            selectedUserIds={field.state.value}
            onChange={field.handleChange}
            currentUserId={userId || undefined}
          />
        )}
      </form.Field>

      {/* Submit row */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isPending || isSubmitting}
            >
              {isPending || isSubmitting ? 'Creating...' : 'Create Page'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useCreateBoard } from '../hooks'
import { createBoardSchema } from '../model'
import { mapCreateBoardError } from '../lib'
import { CollaboratorPicker } from './collaborator-picker'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { useAuth } from '@/shared/hooks'

interface CreateBoardFormProps {
  workspaceId: string
  projectId?: string
  onSuccess?: (boardId: string) => void
  onCancel?: () => void
}

/**
 * Form for creating a new whiteboard board
 *
 * Features: TanStack Form, Zod validation, optimistic updates, collaborator selection
 */
export function CreateBoardForm({
  workspaceId,
  projectId,
  onSuccess,
  onCancel,
}: CreateBoardFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: createBoard, isPending } = useCreateBoard()
  const { userId } = useAuth()

  const form = useForm({
    defaultValues: {
      workspaceId,
      projectId,
      title: '',
      description: '',
      collaboratorIds: userId ? [userId] : ([] as Array<string>),
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        const result = await createBoard(value)
        toast.success('Board created successfully')
        onSuccess?.(result.createBoard.board.id)
      } catch (error: any) {
        const message = mapCreateBoardError(error)
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
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {rootError}
        </div>
      )}

      {/* Title Field */}
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) => {
            const result = createBoardSchema.shape.title.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Board Title *</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="My Whiteboard"
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

      {/* Description Field */}
      <form.Field
        name="description"
        validators={{
          onChange: ({ value }) => {
            if (!value) return undefined
            const result = createBoardSchema.shape.description.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Description (Optional)</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Describe what this board is for..."
              disabled={isPending}
              rows={3}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
            {field.state.value && (
              <p className="text-sm text-muted-foreground">
                {field.state.value.length}/500 characters
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Collaborator Selection */}
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
              {isPending ? 'Creating...' : 'Create Board'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}

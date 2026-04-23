import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useUpdateDescription } from '../hooks'
import { updateDescriptionSchema } from '../model'
import { mapUpdateDescriptionError } from '../lib'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { Label } from '@/shared/ui/primitives/label'

interface UpdateDescriptionDialogProps {
  boardId: string
  currentDescription?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UpdateDescriptionDialog({
  boardId,
  currentDescription,
  open,
  onOpenChange,
  onSuccess,
}: UpdateDescriptionDialogProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: updateDescription, isPending } = useUpdateDescription()

  const form = useForm({
    defaultValues: {
      boardId,
      description: currentDescription || '',
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        await updateDescription(value)
        toast.success('Description updated successfully')
        onSuccess?.()
        onOpenChange(false)
      } catch (error: any) {
        const message = mapUpdateDescriptionError(error)
        setRootError(message)
        toast.error(message)
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Description</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          {rootError && (
            <div className="rounded-md bg-danger-subtle p-3 text-sm text-danger-primary">
              {rootError}
            </div>
          )}

          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                if (!value) return undefined
                const result =
                  updateDescriptionSchema.shape.description.safeParse(value)
                if (!result.success) return result.error.issues[0].message
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Describe what this board is for..."
                  disabled={isPending}
                  rows={5}
                  maxHeight="xl"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-danger-primary">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
                <p className="text-sm text-secondary">
                  {field.state.value.length}/500 characters
                </p>
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit]) => (
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

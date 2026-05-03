import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useState } from 'react'
import { useCreateProjectRole } from '../hooks/use-create-project-role'
import { createProjectRoleSchema } from '../model/schema'
import { mapCreateProjectRoleError } from '../lib/error-mapping'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { Textarea } from '@/shared/ui/primitives/textarea'

interface CreateProjectRoleFormProps {
  projectId: string
  workspaceId: string
  existingRoleNames: Array<string>
  onSuccess?: () => void
  onClose?: () => void
}

export function CreateProjectRoleForm({
  projectId,
  workspaceId,
  existingRoleNames,
  onSuccess,
  onClose,
}: CreateProjectRoleFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: createRole, isPending } = useCreateProjectRole(projectId, workspaceId)

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      rank: 10,
    },
    onSubmit: async ({ value }) => {
      setRootError(null)

      // Client-side duplicate check
      const isDuplicate = existingRoleNames.some(
        (name) => name.toLowerCase() === value.name.trim().toLowerCase()
      )
      if (isDuplicate) {
        const msg = 'A role with this name already exists'
        setRootError(msg)
        toast.error(msg)
        return
      }

      try {
        await createRole({
          name: value.name.trim(),
          description: value.description?.trim(),
          rank: value.rank,
        })
        toast.success('Role created successfully')
        onSuccess?.()
        onClose?.()
      } catch (error: any) {
        const message = mapCreateProjectRoleError(error)
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
      className="space-y-4 pt-4"
    >
      {rootError && (
        <div className="rounded-md bg-danger-subtle p-3 text-14 font-medium text-danger-primary">
          {rootError}
        </div>
      )}

      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            const result = createProjectRoleSchema.shape.name.safeParse(value)
            if (!result.success) return result.error.issues[0].message

            const isDuplicate = existingRoleNames.some(
              (name) => name.toLowerCase() === value.trim().toLowerCase()
            )
            if (isDuplicate) return 'A role with this name already exists'

            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Role Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. Designer, Support"
              disabled={isPending}
              autoFocus
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-14 text-danger-primary font-medium">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="description"
        validators={{
          onChange: ({ value }) => {
            const result = createProjectRoleSchema.shape.description.safeParse(value)
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
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Briefly describe the purpose of this role"
              disabled={isPending}
              rows={3}
              maxHeight="xl"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-14 text-danger-primary font-medium">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="rank"
        validators={{
          onChange: ({ value }) => {
            const result = createProjectRoleSchema.shape.rank.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Rank (1-100)</Label>
            <Input
              id={field.name}
              type="number"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                const val = e.target.value
                if (val === '') {
                  field.handleChange(undefined as any)
                } else {
                  field.handleChange(Number(val))
                }
              }}
              placeholder="10"
              disabled={isPending}
            />
            <p className="text-11 text-secondary">
              Higher rank roles can manage lower rank members.
            </p>
            {field.state.meta.errors.length > 0 && (
              <p className="text-12 text-danger-primary font-medium">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? 'Creating...' : 'Create Role'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}
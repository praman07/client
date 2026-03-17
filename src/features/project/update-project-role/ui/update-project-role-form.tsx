import { useUpdateProjectRoleForm } from '../hooks/use-update-project-role-form'
import { updateProjectRoleSchema } from '../model/schema'
import type { ZodIssue, ZodType } from 'zod'
import type { UpdateProjectRoleFormValues } from '../model/schema'
import { Button, Input, Label, Textarea } from '@/shared/ui'

function validateZod(schema: ZodType<unknown>) {
  return ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value)
    if (!result.success)
      return result.error.issues.map((e: ZodIssue) => e.message).join(', ')
    return undefined
  }
}

 
function FieldError({ field }: { field: any }) {
  if (!field.state.meta.isTouched || !field.state.meta.errors.length)
    return null
  return (
    <p className="text-sm font-medium text-destructive">
      {field.state.meta.errors.join(', ')}
    </p>
  )
}

interface UpdateProjectRoleFormProps {
  roleId: string
  projectId: string
  workspaceId: string
  defaultValues: UpdateProjectRoleFormValues
  onSuccess?: () => void
}

export function UpdateProjectRoleForm({
  roleId,
  projectId,
  workspaceId,
  defaultValues,
  onSuccess,
}: UpdateProjectRoleFormProps) {
  const { form, isPending } = useUpdateProjectRoleForm({
    roleId,
    projectId,
    workspaceId,
    defaultValues,
    onSuccess,
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
          onChange: validateZod(updateProjectRoleSchema.shape.name),
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Role Name</Label>
            <Input
              id={field.name}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldError field={field} />
          </div>
        )}
      />

      <form.Field
        name="rank"
        validators={{
          onChange: validateZod(updateProjectRoleSchema.shape.rank),
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Rank</Label>
            <Input
              id={field.name}
              type="number"
              min={1}
              max={99}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            <FieldError field={field} />
          </div>
        )}
      />

      <form.Field
        name="description"
        validators={{
          onChange: validateZod(updateProjectRoleSchema.shape.description),
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Description</Label>
            <Textarea
              id={field.name}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={2}
            />
            <FieldError field={field} />
          </div>
        )}
      />

      <div className="flex justify-end pt-2">
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isPending || isSubmitting}
            >
              {isPending || isSubmitting ? 'Saving...' : 'Save Role'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}

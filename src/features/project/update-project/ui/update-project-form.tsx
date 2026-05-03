import { useUpdateProjectForm } from '../hooks/use-update-project-form'
import { updateProjectSchema } from '../model/schema'
import type { ZodIssue, ZodType } from 'zod'
import type { UpdateProjectFormValues } from '../model/schema'
import { Button, Input, Label, Separator, Textarea } from '@/shared/ui'

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
    <p className="text-13 font-medium text-danger-primary">
      {field.state.meta.errors.join(', ')}
    </p>
  )
}

interface UpdateProjectFormProps {
  projectId: string
  workspaceId: string
  defaultValues: UpdateProjectFormValues
  onSuccess?: () => void
}

export function UpdateProjectForm({
  projectId,
  workspaceId,
  defaultValues,
  onSuccess,
}: UpdateProjectFormProps) {
  const { form, isPending } = useUpdateProjectForm({
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
      className="space-y-5"
    >
      <form.Field
        name="name"
        validators={{ onChange: validateZod(updateProjectSchema.shape.name) }}
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Project Name</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="My Project"
            />
            <FieldError field={field} />
          </div>
        )}
      />

      <form.Field
        name="description"
        validators={{
          onChange: validateZod(updateProjectSchema.shape.description),
        }}
        children={(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Description</Label>
            <Textarea
              id={field.name}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              maxLength={500}
              maxHeight="lg"
            />
            <div className="flex items-center justify-between">
              <FieldError field={field} />
              <span className="text-11 text-secondary ml-auto">
                {(field.state.value ?? '').length}/500
              </span>
            </div>
          </div>
        )}
      />

      <Separator />

      {/* Actions — only shown when form is dirty */}
      <form.Subscribe
        selector={(s) => ({
          canSubmit: s.canSubmit,
          isSubmitting: s.isSubmitting,
          isDirty: s.isDirty,
        })}
        children={({ canSubmit, isSubmitting, isDirty }) => (
          <div className="flex items-center justify-end gap-2">
            {isDirty && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => form.reset()}
                disabled={isPending || isSubmitting}
              >
                Reset
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={!canSubmit || !isDirty || isPending || isSubmitting}
            >
              {isPending || isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      />
    </form>
  )
}

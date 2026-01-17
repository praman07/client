import { Loader2 } from 'lucide-react'

import { createProjectSchema, sanitizeSlug, validateZod } from '../model/schema'
import { useCreateProjectForm } from '../hooks'

import { Button, Input, Label, Textarea } from '@/shared/ui'

// Helper Component for Errors
function FieldInfo({ field }: { field: any }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-sm font-medium text-destructive">
          {field.state.meta.errors.join(', ')}
        </p>
      ) : null}
    </>
  )
}

interface CreateProjectFormProps {
  workspaceId: string
  onSuccess?: () => void
}

export function CreateProjectForm({
  workspaceId,
  onSuccess,
}: CreateProjectFormProps) {
  const { form, isCreating, checkSlug, handleNameChange } =
    useCreateProjectForm({
      workspaceId,
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
          onChange: validateZod(createProjectSchema.shape.name),
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Project Name</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Mobile App"
            />
            <FieldInfo field={field} />
          </div>
        )}
      />

      <form.Field
        name="slug"
        asyncDebounceMs={500}
        validators={{
          onChange: validateZod(createProjectSchema.shape.slug),
          onChangeAsync: async ({ value }) => {
            if (!value || value.length < 3) return null
            try {
              const res = await checkSlug({ workspaceId, slug: value })
              if (!res.checkProjectSlugAvailability.available) {
                return (
                  res.checkProjectSlugAvailability.message || 'Slug is taken'
                )
              }
              return null
            } catch (e) {
              return null
            }
          },
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              Project Slug
              {field.state.meta.isValidating && (
                <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />
              )}
            </Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(sanitizeSlug(e.target.value))
              }}
              placeholder="mobile-app"
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Unique key for the project URL.
            </p>
            <FieldInfo field={field} />
          </div>
        )}
      />

      <form.Field
        name="description"
        validators={{
          onChange: validateZod(createProjectSchema.shape.description),
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Description</Label>
            <Textarea
              id={field.name}
              value={field.state.value || ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Project details..."
            />
            <FieldInfo field={field} />
          </div>
        )}
      />

      <div className="flex justify-end pt-2">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isCreating || isSubmitting}
            >
              {isCreating || isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}

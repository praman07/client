import { createWorkspaceSchema } from '../model'
import { useCheckSlugAvailability } from '../hooks'
import type { WorkspaceFormApi } from '../model'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { Spinner } from '@/shared/ui/primitives/spinner'

interface Props {
  form: WorkspaceFormApi
}

export function WorkspaceSlugField({ form }: Props) {
  const { mutateAsync: checkSlug } = useCheckSlugAvailability()

  return (
    <form.Field
      name="slug"
      validators={{
        onChange: ({ value }) => {
          const result = createWorkspaceSchema.shape.slug.safeParse(value)
          if (!result.success) return result.error.issues[0].message
          return undefined
        },
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: async ({ value }) => {
          if (form.state.isSubmitting) return null
          if (!value || value.length < 3) return null
          const basicValidation =
            createWorkspaceSchema.shape.slug.safeParse(value)
          if (!basicValidation.success) return null

          try {
            const response = await checkSlug(value)

            // Stale Guard: If current form value differs from the value we checked, ignore this result.
            if (value !== form.state.values.slug) return null

            if (!response.checkSlugAvailability.available) {
              return 'Slug is already taken'
            }
          } catch (e) {
            console.error('Validation check failed', e)
          }
          return null
        },
      }}
    >
      {(field) => (
        <div className="space-y-3">
          <Label htmlFor={field.name} className="text-base font-medium">
            Workspace URL
          </Label>
          <div className="flex rounded-md shadow-sm">
            <div className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground sm:text-sm h-12">
              collabify.com/
            </div>
            <div className="relative flex-1">
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-'),
                  )
                }
                placeholder="acme-corp"
                className="h-12 rounded-l-none text-base px-4 pr-10"
              />
              {field.state.meta.isValidating && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Spinner className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          {field.state.meta.errors.length > 0 && (
            <p className="text-sm text-destructive font-medium">
              {field.state.meta.errors.join(', ')}
            </p>
          )}
        </div>
      )}
    </form.Field>
  )
}

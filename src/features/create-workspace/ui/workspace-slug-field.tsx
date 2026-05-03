import { createWorkspaceSchema } from '../model'
import { useCheckSlugAvailability } from '../hooks'
import type { WorkspaceFormApi } from '../model'
import { Input, Label, Spinner } from '@/shared/ui'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('app:workspace')

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
            log.error('Validation check failed', e)
          }
          return null
        },
      }}
    >
      {(field) => (
        <div className="space-y-3">
          <Label htmlFor={field.name} className="text-14 font-medium">
            Workspace URL
          </Label>
          <div className="flex rounded-md shadow-raised-100">
            <div className="flex items-center rounded-l-md border border-r-0 border-subtle-1 bg-layer-2 px-3 text-12 text-secondary">
              {typeof window !== 'undefined' ? `${window.location.origin}/workspace/` : '/workspace/'}
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
                className="h-10 rounded-l-none text-14 px-4 pr-10"
              />
              {field.state.meta.isValidating && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Spinner className="h-4 w-4 text-tertiary" />
                </div>
              )}
            </div>
          </div>
          {field.state.meta.errors.length > 0 && (
            <p className="text-13 text-danger-primary font-medium">
              {field.state.meta.errors.join(', ')}
            </p>
          )}
        </div>
      )}
    </form.Field>
  )
}

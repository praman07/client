import { useCheckChannelSlug } from '../hooks'
import { createChannelSchema } from '../model'
import type { ChannelFormApi } from '../model'
import { Input, Label, Spinner } from '@/shared/ui'

interface Props {
  form: ChannelFormApi
  projectId: string
}

export function ChannelNameField({ form, projectId }: Props) {
  const { mutateAsync: checkSlug } = useCheckChannelSlug()

  return (
    <form.Field
      name="name"
      validators={{
        onChange: ({ value }: { value: string }) => {
          const result = createChannelSchema.shape.name.safeParse(value)
          if (!result.success) return result.error.issues[0].message
          return undefined
        },
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: async ({ value }: { value: string }) => {
          if (!value || value.length < 1) return null

          // Basic syntax check first
          const basicCheck = createChannelSchema.shape.name.safeParse(value)
          if (!basicCheck.success) return null

          try {
            const response = await checkSlug({ projectId, slug: value })
            if (!response.checkChannelAvailability.available) {
              return (
                response.checkChannelAvailability.message || 'Name is taken'
              )
            }
          } catch (e) {
            console.error('Availability check failed', e)
          }
          return null
        },
      }}
    >
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={field.name}>Channel Name</Label>
          <div className="relative">
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="general"
              className="pr-10"
            />
            {field.state.meta.isValidating && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Spinner className="h-4 w-4 text-secondary" />
              </div>
            )}
          </div>

          {field.state.meta.errors.length > 0 ? (
            <p className="text-14 font-medium text-danger-primary">
              {field.state.meta.errors.join(', ')}
            </p>
          ) : (
            !field.state.meta.isValidating &&
            field.state.value.length > 0 && (
              <p className="text-[0.8rem] text-secondary">
                Lowercase, numbers, and hyphens only.
              </p>
            )
          )}
        </div>
      )}
    </form.Field>
  )
}

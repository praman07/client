import { createWorkspaceSchema } from '../model'
import type { WorkspaceFormApi } from '../model'
import { Input, Label } from '@/shared/ui'

interface Props {
  form: WorkspaceFormApi
}

export function WorkspaceNameField({ form }: Props) {
  return (
    <form.Field
      name="name"
      validators={{
        onChange: ({ value }) => {
          const result = createWorkspaceSchema.shape.name.safeParse(value)
          if (!result.success) return result.error.issues[0].message
          return undefined
        },
      }}
    >
      {(field) => (
        <div className="space-y-3">
          <Label htmlFor={field.name} className="text-14 font-medium">
            Workspace Name
          </Label>
          <Input
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="e.g., Acme Corporation"
            className="h-12 text-14 px-4"
          />
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

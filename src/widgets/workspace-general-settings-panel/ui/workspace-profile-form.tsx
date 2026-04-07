import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { mapUpdateWorkspaceError } from '../lib/error-mapping'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/shared/ui/primitives/card'

const profileSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100),
})

interface WorkspaceProfileFormProps {
  initialName: string
  onSave: (name: string) => Promise<void>
}

export function WorkspaceProfileForm({
  initialName,
  onSave,
}: WorkspaceProfileFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialName,
    },
    onSubmit: async ({ value }) => {
      try {
        await onSave(value.name)
        toast.success('Workspace profile updated')
        form.reset({ name: value.name })
      } catch (error: any) {
        toast.error(mapUpdateWorkspaceError(error))
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          General information about your workspace.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <CardContent className="space-y-4">
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = profileSchema.shape.name.safeParse(value)
                if (!result.success) return result.error.issues[0].message
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Workspace Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Acme Inc."
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive font-medium">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>
        <CardFooter className="border-t bg-muted/30 px-6 py-4 flex justify-end">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
            children={([canSubmit, isSubmitting, isDirty]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting || !isDirty}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          />
        </CardFooter>
      </form>
    </Card>
  )
}

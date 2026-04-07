import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Info } from 'lucide-react'
import { mapRenameSlugError } from '../lib/error-mapping'
import { Button } from '@/shared/ui/primitives/button'

import { Label } from '@/shared/ui/primitives/label'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/shared/ui/primitives/card'
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/shared/ui/primitives/alert'

const slugSchema = z.object({
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(64)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
})

interface WorkspaceSlugRenameFormProps {
  initialSlug: string
  currentUrl: string
  onRename: (slug: string) => Promise<void>
}

export function WorkspaceSlugRenameForm({
  initialSlug,
  currentUrl,
  onRename,
}: WorkspaceSlugRenameFormProps) {
  const form = useForm({
    defaultValues: {
      slug: initialSlug,
    },
    onSubmit: async ({ value }) => {
      if (value.slug === initialSlug) return

      try {
        await onRename(value.slug)
        toast.success('Workspace URL updated')
        form.reset({ slug: value.slug })
      } catch (error: any) {
        toast.error(mapRenameSlugError(error))
      }
    },
  })

  return (
    <Card className="border-destructive/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone: Workspace URL</CardTitle>
        <CardDescription>
          Changing your workspace URL will break all existing links to files and projects.
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
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/10">
            <Info className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription className="text-xs">
              Anyone using your old URL will get a 404 error. Make sure to update your shared links.
            </AlertDescription>
          </Alert>

          <form.Field
            name="slug"
            validators={{
              onChange: ({ value }) => {
                const result = slugSchema.shape.slug.safeParse(value)
                if (!result.success) return result.error.issues[0].message
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Workspace URL</Label>
                <div className="flex items-center gap-0 h-10 w-full rounded-md border border-input bg-transparent px-0 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <span className="shrink-0 flex items-center h-full px-3 text-sm text-muted-foreground bg-muted/50 border-r rounded-l-md font-medium select-none">
                    {currentUrl.replace(initialSlug, '')}
                  </span>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value.toLowerCase())}
                    className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive font-medium">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>
        <CardFooter className="border-t bg-destructive/3 flex items-center justify-end py-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
            children={([canSubmit, isSubmitting, isDirty]) => (
              <Button 
                type="submit" 
                variant="destructive"
                disabled={!canSubmit || isSubmitting || !isDirty || form.state.values.slug === initialSlug}
              >
                {isSubmitting ? 'Updating...' : 'Update Workspace URL'}
              </Button>
            )}
          />
        </CardFooter>
      </form>
    </Card>
  )
}

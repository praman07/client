import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCreateWorkspace } from '../api/mutations'
import { mapCreateWorkspaceError } from '../lib/error-mapping'
import { TeamSizeField } from './form-fields/team-size-field'
import { WorkspaceLogoField } from './form-fields/workspace-logo-field'
import { WorkspaceNameField } from './form-fields/workspace-name-field'
import { WorkspaceSlugField } from './form-fields/workspace-slug-field'
import { Spinner } from '@/shared/ui/primitives/spinner'
import { Separator } from '@/shared/ui/primitives/separator'
import { Button } from '@/shared/ui/primitives/button'

export function CreateWorkspaceForm() {
  const navigate = useNavigate()
  const [rootError, setRootError] = useState<string | null>(null)

  const { mutateAsync: createWorkspace, isPending: isCreating } =
    useCreateWorkspace()

  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      teamSize: 'just_me' as 'just_me' | '1-10' | '10-50' | '50+',
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        const data = await createWorkspace({
          slug: value.slug,
          name: value.name,
        })

        toast.success(`Workspace ${data.createWorkspace.name} created!`)
        navigate({ to: `/workspace/${data.createWorkspace.slug}` })
      } catch (error) {
        const message = mapCreateWorkspaceError(error)
        setRootError(message)
        // Only toast if it's a generic fallback that wouldn't show in the UI alert
        if (message.includes('Failed to create')) {
          toast.error(message)
        }
      }
    },
  })

  return (
    <div className="w-full max-w-[600px] mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create your workspace
        </h1>
        <p className="text-muted-foreground text-lg">
          Set up your team's collaborative environment
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-8"
      >
        <WorkspaceLogoField />
        <WorkspaceNameField form={form} />
        <WorkspaceSlugField form={form} />
        <TeamSizeField form={form} />

        {rootError && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
            {rootError}
          </div>
        )}

        <div className="space-y-6 pt-2">
          <Separator />
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="px-0 text-muted-foreground hover:text-foreground"
            >
              Join existing workspace instead
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit]) => (
                <Button
                  type="submit"
                  className="h-10 px-8 text-base"
                  disabled={!canSubmit || isCreating}
                >
                  {isCreating ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" /> Creating...
                    </>
                  ) : (
                    'Create Workspace'
                  )}
                </Button>
              )}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { mapCreateWorkspaceError } from '../lib'
import { useCreateWorkspace } from '../hooks'
import { TeamSizeField } from './team-size-field'
import { WorkspaceLogoField } from './workspace-logo-field'
import { WorkspaceNameField } from './workspace-name-field'
import { WorkspaceSlugField } from './workspace-slug-field'
import { Button, Separator, Spinner } from '@/shared/ui'

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
        navigate({ to: '/workspace/$workspaceSlug', params: { workspaceSlug: data.createWorkspace.slug } })
      } catch (error) {
        const message = mapCreateWorkspaceError(error)
        setRootError(message)
        if (message.includes('Failed to create')) {
          toast.error(message)
        }
      }
    },
  })

  return (
    <div className="w-full max-w-[600px] mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-32 font-semibold tracking-tight text-primary">
          Create your workspace
        </h1>
        <p className="text-16 text-secondary">
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
          <div className="rounded-md bg-danger-subtle p-3 text-13 font-medium text-danger-primary">
            {rootError}
          </div>
        )}

        <div className="space-y-6 pt-2">
          <Separator />
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="px-0 text-secondary hover:text-primary"
            >
              Join existing workspace instead
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit]) => (
                <Button
                  type="submit"
                  className="h-10 px-8 text-14"
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

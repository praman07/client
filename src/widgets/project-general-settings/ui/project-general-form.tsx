import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { TriangleAlert } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ProjectLogoUploader } from './project-logo-uploader'
import type { ProjectFieldsFragment } from '@/gql/graphql'
import { usePermission } from '@/shared/lib/auth'
import { Label } from '@/shared/ui/primitives/label'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { Spinner } from '@/shared/ui'
import { GqlClient } from '@/shared/api'
import { useAppDispatch, useAuth  } from '@/shared/hooks'
import {
  UPDATE_PROJECT,
  projectKeys,
} from '@/entities/project'
import { setCurrentProject } from '@/entities/project/model/slice'
import { CHECK_SLUG } from '@/features/project/create-project/api/fragments'
import { EditableField } from '@/widgets/workspace-general-settings-panel/ui/editable-field'

const nameSchema = z
  .string()
  .min(1, 'Project name is required')
  .max(100, 'Name must be less than 100 characters')

const keySchema = z
  .string()
  .min(2, 'Key must be at least 2 characters')
  .max(32, 'Key must be less than 32 characters')
  .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens')

const descriptionSchema = z
  .string()
  .max(500, 'Description must be less than 500 characters')
  .optional()

/** Normalize to a valid project key slug */
function toKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface ProjectGeneralFormProps {
  project: ProjectFieldsFragment
  workspaceId: string
  workspaceSlug: string
}

export function ProjectGeneralForm({
  project,
  workspaceId,
  workspaceSlug,
}: ProjectGeneralFormProps) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const canUpdate = usePermission('project:update')

  const initialName = project.name
  const initialKey = project.key
  const initialDescription = project.description ?? ''

  const form = useForm({
    defaultValues: {
      name: initialName,
      key: initialKey,
      description: initialDescription,
    },
    onSubmit: async ({ value }) => {
      const hasNameChange = value.name !== initialName
      const hasKeyChange = value.key !== initialKey
      const hasDescriptionChange = value.description !== initialDescription

      if (!hasNameChange && !hasKeyChange && !hasDescriptionChange) {
        toast.info('No changes to save')
        return
      }

      const input: Record<string, string | undefined> = {}
      if (hasNameChange) input.name = value.name
      if (hasDescriptionChange) input.description = value.description
      if (hasKeyChange) input.key = value.key

      try {
        const token = await getToken()
        const result = await GqlClient(token).request(UPDATE_PROJECT, {
          projectId: project.id,
          input,
        })

        const updated = result.updateProject

        // Update Redux store immediately
        dispatch(setCurrentProject(updated as any))

        // Invalidate all relevant query keys
        queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(workspaceId, project.id),
        })
        // Invalidate old slug key
        queryClient.invalidateQueries({
          queryKey: projectKeys.bySlug(workspaceId, initialKey),
        })

        toast.success('Settings saved')

        // If key changed, navigate to the new project URL
        if (hasKeyChange) {
          navigate({
            to: '/workspace/$workspaceSlug/project/$projectSlug/settings/general',
            params: { workspaceSlug, projectSlug: value.key },
          })
        }
      } catch (err: any) {
        const msg = err?.response?.errors?.[0]?.message || err.message || 'Failed to save'
        toast.error(msg)
      }
    },
  })

  return (
    <form
      id="project-general-settings-form"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-0"
    >
      {/* 2-column grid: left fields, right icon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-7">

        {/* LEFT COLUMN */}
        <div className="space-y-7">

          {/* Project Name — view/edit mode */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const r = nameSchema.safeParse(value)
                return r.success ? undefined : r.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
                  Project Name
                </Label>
                <EditableField
                  id="field-project-name"
                  value={field.state.value}
                  placeholder="My Project"
                  onChange={(v: string) => field.handleChange(v)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors[0]}
                  disabled={!canUpdate}
                />
              </div>
            )}
          </form.Field>

          {/* Project Key (slug) — split input with async check */}
          <form.Field
            name="key"
            validators={{
              onChange: ({ value }) => {
                const r = keySchema.safeParse(value)
                return r.success ? undefined : r.error.issues[0].message
              },
              onChangeAsyncDebounceMs: 400,
              onChangeAsync: async ({ value }) => {
                if (!value || value.length < 2) return null
                // Skip check if unchanged
                if (value === initialKey) return null
                const basic = keySchema.safeParse(value)
                if (!basic.success) return null

                try {
                  const token = await getToken()
                  const response = await GqlClient(token).request(CHECK_SLUG, {
                    workspaceId,
                    slug: value,
                  })
                  // Stale guard: ignore result if form value has moved on
                  if (value !== form.state.values.key) return null
                  if (!response.checkProjectSlugAvailability.available) {
                    return 'This key is already taken in this workspace'
                  }
                } catch {
                  // Ignore availability check errors silently
                }
                return null
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
                  Project Key
                </Label>
                {/* Split key input: workspace prefix + editable key */}
                <div className="flex h-10 rounded-md border border-subtle-1 bg-transparent overflow-hidden">
                  <span className="flex items-center shrink-0 px-2 sm:px-3 text-xs sm:text-sm text-secondary bg-layer-2 border-r select-none">
                    {workspaceSlug}/
                  </span>
                  <div className="relative flex-1 min-w-0">
                    <input
                      id="field-project-key"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        canUpdate && field.handleChange(toKey(e.target.value))
                      }
                      readOnly={!canUpdate}
                      className="w-full h-full bg-transparent px-2 sm:px-3 text-sm outline-none placeholder:text-placeholder read-only:cursor-default read-only:opacity-70 truncate"
                      placeholder="my-project"
                    />
                    {field.state.meta.isValidating && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-2 pl-1">
                        <Spinner className="h-3.5 w-3.5 text-secondary" />
                      </div>
                    )}
                  </div>
                </div>
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-danger-primary">{field.state.meta.errors[0]}</p>
                ) : field.state.value !== initialKey ? (
                  <p className="flex items-center gap-1.5 text-xs text-amber-500">
                    <TriangleAlert className="h-3 w-3 shrink-0" />
                    Changing the key will update all project URLs
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Description */}
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                const r = descriptionSchema.safeParse(value)
                return r.success ? undefined : r.error.issues[0].message
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
                  Description
                </Label>
                <Textarea
                  id="field-project-description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  readOnly={!canUpdate}
                  placeholder="What is this project about?"
                  className="min-h-[88px] max-h-[200px] resize-y text-sm"
                  maxLength={500}
                />
                {field.state.meta.errors[0] && (
                  <p className="text-sm text-danger-primary">{field.state.meta.errors[0]}</p>
                )}
                <p className="text-xs text-secondary text-right">
                  {field.state.value?.length ?? 0}/500
                </p>
              </div>
            )}
          </form.Field>
        </div>

        {/* RIGHT COLUMN: Logo uploader (ordered first on mobile) */}
        <div className="space-y-2 lg:pt-6 order-first lg:order-0 mb-4 lg:mb-0">
          <Label className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
            Project Icon
          </Label>
          <ProjectLogoUploader
            name={project.name}
            logoUrl={project.logoUrl}
            projectId={project.id}
            workspaceId={workspaceId}
            readOnly={!canUpdate}
          />
        </div>
      </div>

      {/* Save Changes button — only visible when dirty AND user can update */}
      {canUpdate && (
        <form.Subscribe
          selector={(state) => [state.isDirty, state.canSubmit, state.isSubmitting]}
          children={([isDirty, canSubmit, isSubmitting]) =>
            isDirty ? (
              <div className="flex justify-end pt-8 border-t mt-8">
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting ? (
                    <><Spinner className="h-4 w-4 mr-2" /> Saving...</>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            ) : null
          }
        />
      )}
    </form>
  )
}

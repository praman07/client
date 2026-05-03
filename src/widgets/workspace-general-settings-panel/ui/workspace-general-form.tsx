import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { TriangleAlert } from 'lucide-react'
import {
  mapRenameSlugError,
  mapUpdateWorkspaceError,
} from '../lib/error-mapping'
import { WorkspaceLogoUploader } from './workspace-logo-uploader'
import { EditableField } from './editable-field'
import { usePermission } from '@/shared/lib/auth'
import { Label } from '@/shared/ui/primitives/label'
import { Button } from '@/shared/ui/primitives/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select'
import { Spinner } from '@/shared/ui'
import { useCheckSlugAvailability } from '@/features/create-workspace/hooks'

const COMPANY_SIZES = [
  '1-10 Employees',
  '11-50 Employees',
  '51-200 Employees',
  '201-500 Employees',
  '500+ Employees',
]

const TIMEZONES = [
  '(GMT-12:00) International Date Line West',
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-07:00) Mountain Time (US & Canada)',
  '(GMT-06:00) Central Time (US & Canada)',
  '(GMT-05:00) Eastern Time (US & Canada)',
  '(GMT+00:00) UTC',
  '(GMT+01:00) Amsterdam, Berlin, Rome',
  '(GMT+05:30) Chennai, Kolkata, Mumbai',
  '(GMT+08:00) Beijing, Singapore',
  '(GMT+09:00) Tokyo, Seoul',
  '(GMT+10:00) Sydney, Melbourne',
]

const nameSchema = z.string().min(1, 'Workspace name is required').max(100)
// Slug schema aligned with server SLUG_CONFIG (MIN=3, MAX=64).
// Client regex is intentionally more permissive (allows leading/trailing/consecutive hyphens)
// — server SLUG_REGEX is authoritative; this gives fast local feedback only.
const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(64, 'Slug must be at most 64 characters')
  .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens')

/** Same normalization as create-workspace slug field */
function toSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
}

interface WorkspaceGeneralFormProps {
  workspaceId: string
  initialName: string
  initialSlug: string
  logoUrl?: string | null
  urlPrefix: string
  onSaveName: (name: string) => Promise<void>
  onSaveSlug: (slug: string) => Promise<void>
}

export function WorkspaceGeneralForm({
  workspaceId,
  initialName,
  initialSlug,
  logoUrl,
  urlPrefix,
  onSaveName,
  onSaveSlug,
}: WorkspaceGeneralFormProps) {
  const { mutateAsync: checkSlug } = useCheckSlugAvailability()

  // Permission gate — workspace:update required for any write to name/slug/logo/settings
  const canUpdate = usePermission('workspace:update')

  const form = useForm({
    defaultValues: {
      name: initialName,
      slug: initialSlug,
    },
    onSubmit: async ({ value }) => {
      const promises: Array<Promise<void>> = []

      if (value.name !== initialName) {
        promises.push(
          onSaveName(value.name).catch((err: any) => {
            throw new Error(mapUpdateWorkspaceError(err))
          }),
        )
      }
      if (value.slug !== initialSlug) {
        promises.push(
          onSaveSlug(value.slug).catch((err: any) => {
            throw new Error(mapRenameSlugError(err))
          }),
        )
      }
      if (promises.length === 0) {
        toast.info('No changes to save')
        return
      }
      try {
        await Promise.all(promises)
        toast.success('Settings saved')
      } catch (err: any) {
        toast.error(err.message || 'Failed to save changes')
      }
    },
  })

  return (
    <form
      id="general-settings-form"
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
          {/* Workspace Name — view/edit mode */}
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
                <Label className="text-11 font-semibold uppercase tracking-widest text-secondary">
                  Workspace Name
                </Label>
                <EditableField
                  id="field-name"
                  value={field.state.value}
                  placeholder="Acme Corp"
                  onChange={(v: string) => field.handleChange(v)}
                  onBlur={field.handleBlur}
                  error={field.state.meta.errors[0]}
                  disabled={!canUpdate}
                />
              </div>
            )}
          </form.Field>

          {/* Workspace Slug — view/edit with async check */}
          <form.Field
            name="slug"
            validators={{
              onChange: ({ value }) => {
                const r = slugSchema.safeParse(value)
                return r.success ? undefined : r.error.issues[0].message
              },
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                // Skip check if unchanged or still equals initial slug
                if (!value || value.length < 3) return null
                if (value === initialSlug) return null
                const basic = slugSchema.safeParse(value)
                if (!basic.success) return null

                try {
                  const response = await checkSlug(value)
                  // Stale guard: ignore result if form value has moved on
                  if (value !== form.state.values.slug) return null
                  if (!response.checkSlugAvailability.available) {
                    return 'This slug is already taken'
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
                <Label className="text-11 font-semibold uppercase tracking-widest text-secondary">
                  Workspace Slug
                </Label>
                {/* Split slug input: prefix + editable part */}
                <div className="flex h-10 rounded-md border border-subtle-1 bg-transparent overflow-hidden">
                  <span className="flex items-center shrink-0 px-2 sm:px-3 text-12 sm:text-13 text-secondary bg-layer-1 border-r border-subtle select-none">
                    {urlPrefix}
                  </span>
                  <div className="relative flex-1 min-w-0">
                    <input
                      id="field-slug"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        canUpdate && field.handleChange(toSlug(e.target.value))
                      }
                      readOnly={!canUpdate}
                      className="w-full h-full bg-transparent px-2 sm:px-3 text-14 outline-none placeholder:text-placeholder read-only:cursor-default read-only:opacity-70 truncate"
                      placeholder="my-workspace"
                    />
                    {field.state.meta.isValidating && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-layer-1 pl-1">
                        <Spinner className="h-3.5 w-3.5 text-secondary" />
                      </div>
                    )}
                  </div>
                </div>
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-14 text-danger-primary">
                    {field.state.meta.errors[0]}
                  </p>
                ) : field.state.value !== initialSlug ? (
                  <p className="flex items-center gap-1.5 text-12 text-warning-primary">
                    <TriangleAlert className="h-3 w-3 shrink-0" />
                    Changing slug will update all workspace URLs
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>

        {/* RIGHT COLUMN: Logo uploader (ordered first on mobile) */}
        <div className="space-y-2 lg:pt-6 order-first lg:order-0 mb-4 lg:mb-0">
          <Label className="text-11 font-semibold uppercase tracking-widest text-secondary">
            Workspace Icon
          </Label>
          <WorkspaceLogoUploader
            name={initialName}
            logoUrl={logoUrl}
            workspaceId={workspaceId}
            readOnly={!canUpdate}
          />
        </div>
      </div>

      {/* Second row: Company Size + Timezone stubs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-7 pt-7">
        <div className="space-y-2">
          <Label className="text-11 font-semibold uppercase tracking-widest text-secondary">
            Company Size
          </Label>
          <Select defaultValue="11-50 Employees" disabled={!canUpdate}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-11 font-semibold uppercase tracking-widest text-secondary">
            Timezone
          </Label>
          <Select
            defaultValue="(GMT-08:00) Pacific Time (US & Canada)"
            disabled={!canUpdate}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Save Changes button — only visible when dirty AND user can update */}
      {canUpdate && (
        <form.Subscribe
          selector={(state) => [
            state.isDirty,
            state.canSubmit,
            state.isSubmitting,
          ]}
          children={([isDirty, canSubmit, isSubmitting]) =>
            isDirty ? (
              <div className="flex justify-end pt-8 border-t border-subtle mt-8">
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" /> Saving...
                    </>
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

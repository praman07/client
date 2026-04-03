import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@/entities/user'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { Textarea } from '@/shared/ui/primitives/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select'
import { useUpdateProfile } from '../hooks/use-update-profile'
import { useClerkProfile } from '../hooks/use-clerk-profile'
import { mapUpdateProfileError } from '../lib/error-mapping'
import { updateProfileSchema } from '../model/schema'

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo',
  'Australia/Sydney',
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
]

/**
 * UpdateProfileForm — TanStack Form for editing user profile data.
 *
 * Data Flow:
 *   1. Form validates via Zod (updateProfileSchema).
 *   2. On submit: call Clerk user.update() FIRST (source of truth for auth data).
 *   3. If Clerk succeeds: call DB mutation to persist remaining fields.
 *   4. If Clerk fails: abort — DB is never written, no drift occurs.
 *   5. On DB success: RQ cache invalidated → useUser() auto-reflects changes.
 *
 * Architecture: Pure feature component. No routing, no side-effects beyond
 * mutation calls. Parent page is responsible for layout.
 */
export function UpdateProfileForm() {
  const { user } = useUser()
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile()
  const { updateClerkName } = useClerkProfile()
  const [rootError, setRootError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const form = useForm({
    defaultValues: {
      fullName: '',
      bio: '',
      timezone: 'UTC',
      language: 'en',
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      setSaved(false)
      try {
        // Step 1: Best-effort sync fullName to Clerk (source of truth for auth SSO display).
        // Non-blocking: if Clerk rejects (plan limits, settings, etc.), we still write to DB.
        // Our DB is the source of truth for in-app display names.
        try {
          await updateClerkName(value.fullName)
        } catch (clerkError) {
          console.warn('[UpdateProfile] Clerk name sync failed (non-blocking):', clerkError)
        }

        // Step 2: Persist all fields to our DB (always runs regardless of Clerk result)
        await updateProfile({
          fullName: value.fullName,
          bio: value.bio ?? null,
          timezone: value.timezone,
          language: value.language,
        })

        setSaved(true)
        toast.success('Profile updated successfully')
        setTimeout(() => setSaved(false), 3000)
      } catch (error) {
        const message = mapUpdateProfileError(error)
        setRootError(message)
        toast.error(message)
      }
    },
  })

  // Populate form once user data loads. Use reset() so these become the
  // new baseline — isDirty stays false until the user actually edits a field.
  useEffect(() => {
    if (!user) return
    form.reset({
      fullName: user.fullName ?? '',
      bio: user.bio ?? '',
      timezone: user.timezone ?? 'UTC',
      language: user.language ?? 'en',
    })
  // Architecture: depend only on user.id to avoid resetting while user types
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-5"
    >
      {/* Root error banner */}
      {rootError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {rootError}
        </div>
      )}

      {/* Full Name */}
      <form.Field
        name="fullName"
        validators={{
          onChange: ({ value }: { value: string }) => {
            const result = updateProfileSchema.shape.fullName.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Full name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Your full name"
              maxLength={80}
              disabled={isPending}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Bio */}
      <form.Field
        name="bio"
        validators={{
          onChange: ({ value }: { value: string }) => {
            const result = updateProfileSchema.shape.bio.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Bio</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Tell your team a bit about yourself…"
              rows={3}
              maxLength={300}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground text-right">
              {(field.state.value ?? '').length}/300
            </p>
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Timezone + Language selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Timezone */}
        <form.Field name="timezone">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="profile-timezone">Timezone</Label>
              {/* Hidden native input satisfies browser form field id/name requirement */}
              <input type="hidden" name="timezone" value={field.state.value} />
              <Select
                value={field.state.value}
                onValueChange={(v) => { if (v) field.handleChange(v) }}
                disabled={isPending}
              >
                <SelectTrigger id="profile-timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        {/* Language */}
        <form.Field name="language">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="profile-language">Language</Label>
              {/* Hidden native input satisfies browser form field id/name requirement */}
              <input type="hidden" name="language" value={field.state.value} />
              <Select
                value={field.state.value}
                onValueChange={(v) => { if (v) field.handleChange(v) }}
                disabled={isPending}
              >
                <SelectTrigger id="profile-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
      </div>

      {/* Submit row */}
      <div className="flex items-center gap-3 pt-1">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
          children={([canSubmit, , isDirty]) => (
            <Button type="submit" disabled={!canSubmit || !isDirty || isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : 'Save changes'}
            </Button>
          )}
        />
        {saved && (
          <span className="flex items-center gap-1 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </form>
  )
}

import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUpdateProfile } from '../hooks/use-update-profile'
import { useClerkProfile } from '../hooks/use-clerk-profile'
import { mapUpdateProfileError } from '../lib/error-mapping'
import { updateProfileSchema } from '../model/schema'
import { useUser } from '@/entities/user'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { Textarea } from '@/shared/ui/primitives/textarea'


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
  const [isLoaded, setIsLoaded] = useState(false)

  const form = useForm({
    defaultValues: {
      fullName: user?.fullName ?? '',
      bio: user?.bio ?? '',
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
          bio: value.bio || null,
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

  useEffect(() => {
    if (!user) return
    form.reset({
      fullName: user.fullName ?? '',
      bio: user.bio ?? '',
    })
    setIsLoaded(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.fullName, user?.bio])

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
        <div className="rounded-lg border border-danger-strong bg-danger-subtle px-3 py-2 text-13 text-danger-primary">
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
              <p className="text-13 text-danger-primary">
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
              maxHeight="xl"
              disabled={isPending}
            />
            <p className="text-11 text-secondary text-right">
              {field.state.value.length}/300
            </p>
            {field.state.meta.errors.length > 0 && (
              <p className="text-13 text-danger-primary">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Submit row */}
      <div className="flex items-center gap-3 pt-1">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
          children={([canSubmit, , isDirty]) => {
            if (!isLoaded) return null
            if (!isDirty) return null
            return (
              <Button
                type="submit"
                disabled={!canSubmit || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : 'Save changes'}
              </Button>
            )
          }}
        />
        {saved && (
          <span className="flex items-center gap-1 text-13 text-success-primary">
            <CheckCircle2 className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </form>
  )
}

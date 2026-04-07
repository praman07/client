import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useClerkProfile } from '../hooks/use-clerk-profile'
import { useUpdateProfile } from '../hooks/use-update-profile'
import { mapUpdateProfileError } from '../lib/error-mapping'
import { useUser } from '@/entities/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'

/**
 * AvatarUploadField — self-contained avatar upload control.
 *
 * Flow: file picked → blob URL shown instantly → Clerk upload + DB sync → permanent CDN URL
 *
 * Key decisions:
 * - Blob URL is shown BEFORE upload so there's zero perceived latency.
 * - Blob URL is managed via a ref and revoked on component unmount or next upload
 *   to prevent memory leaks, NOT in the upload finally-block (which would revoke it
 *   before the browser has painted the permanent CDN URL).
 * - Clerk's `user.reload()` is required after `setProfileImage` because the method
 *   returns an `ImageResource` (not UserResource), so the user.imageUrl closure
 *   is stale until reload() is called.
 */
export function AvatarUploadField() {
  const { user } = useUser()
  const { uploadAvatar } = useClerkProfile()
  const { mutateAsync: updateProfile } = useUpdateProfile()
  const [isUploading, setIsUploading] = useState(false)
  const [optimisticUrl, setOptimisticUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Track the current blob URL so it can be revoked safely on next upload or unmount
  const blobUrlRef = useRef<string | null>(null)

  // Cleanup blob URL when component unmounts to free browser memory
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size before calling Clerk (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image is too large. Please choose a file under 10MB.')
      return
    }

    // Revoke previous blob URL before creating a new one
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
    }

    // Create local blob URL and show it immediately — zero network latency
    const blobUrl = URL.createObjectURL(file)
    blobUrlRef.current = blobUrl
    setOptimisticUrl(blobUrl)
    setIsUploading(true)

    try {
      // Step 1: Upload to Clerk CDN; user.reload() inside ensures imageUrl is fresh
      const avatarUrl = await uploadAvatar(file)

      // Step 2: Persist the permanent Clerk CDN URL to our DB (Redis busted server-side)
      await updateProfile({ avatarUrl })

      // Step 3: Swap blob preview for the permanent CDN URL now that both writes are done
      // Keep blobUrlRef alive until AFTER this render cycle — revoke on next upload/unmount
      setOptimisticUrl(avatarUrl)

      toast.success('Avatar updated successfully')
    } catch (error) {
      // Revert optimistic preview on failure
      setOptimisticUrl(null)
      toast.error(mapUpdateProfileError(error))
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  // The displayed src: optimistic blob/CDN > DB value > nothing (shows fallback)
  const avatarSrc = optimisticUrl ?? user?.avatarUrl ?? undefined

  return (
    <div className="flex items-center gap-5">
      {/* Hidden file input — triggered by clicking the avatar */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Clickable avatar with overlay feedback */}
      <button
        type="button"
        onClick={() => !isUploading && inputRef.current?.click()}
        disabled={isUploading}
        className="relative group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Change profile photo"
      >
        <Avatar className="h-16 w-16 ring-2 ring-border transition-opacity group-hover:opacity-80">
          <AvatarImage src={avatarSrc} alt={user?.fullName ?? 'User'} />
          <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
        </Avatar>

        {/* Upload spinner overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}

        {/* Hover hint overlay */}
        {!isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/0 group-hover:bg-background/50 transition-colors">
            <span className="text-[10px] font-bold text-transparent group-hover:text-foreground transition-colors tracking-tight">
              CHANGE
            </span>
          </div>
        )}
      </button>

      <div>
        <p className="text-sm font-medium">{user?.fullName ?? '—'}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Click to upload · JPEG, PNG, GIF, WebP · Max 10MB
        </p>
      </div>
    </div>
  )
}

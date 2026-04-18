import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { useUploadWorkspaceLogo } from '@/features/workspace/upload-workspace-logo'

interface WorkspaceLogoUploaderProps {
  logoUrl?: string | null
  name: string
  workspaceId: string
  readOnly?: boolean
}

export function WorkspaceLogoUploader({
  logoUrl,
  name,
  workspaceId,
  readOnly = false,
}: WorkspaceLogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  // Local optimistic state — updates immediately after upload without waiting for Redux/Query refetch
  const [localLogoUrl, setLocalLogoUrl] = useState<string | null | undefined>(logoUrl)
  const uploadLogo = useUploadWorkspaceLogo(workspaceId)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setIsUploading(true)
      setProgress(0)
      const uploadedUrl = await uploadLogo(file, setProgress)
      // Immediately update local display — don't wait for Redux cycle
      if (uploadedUrl) setLocalLogoUrl(uploadedUrl)
    } catch {
      // Toast shown by hook
    } finally {
      setIsUploading(false)
      setProgress(0)
      e.target.value = ''
    }
  }

  const displayUrl = localLogoUrl ?? logoUrl
  const initials = name.substring(0, 2).toUpperCase()

  return (
    <div className="flex items-center gap-4">
      {/* Square rounded avatar — matches reference image */}
      <div className="relative shrink-0">
        <Avatar className="h-[72px] w-[72px] rounded-xl border border-subtle">
          <AvatarImage
            src={displayUrl ?? undefined}
            alt={name}
            className="object-cover rounded-xl"
          />
          <AvatarFallback className="rounded-xl text-lg font-bold bg-accent-subtle text-accent-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl">
          <Loader2 className="h-5 w-5 animate-spin text-on-color" />
          <span className="text-10 text-on-color mt-0.5">{progress}%</span>
        </div>
        )}
      </div>

      {/* Right: link + hint — hidden when readOnly */}
      {!readOnly && (
        <div className="space-y-1">
<label
          htmlFor="logo-upload"
          className="block text-14 font-semibold text-accent-primary cursor-pointer hover:underline"
        >
          {isUploading ? 'Uploading...' : 'Upload new Icon'}
        </label>
        <p className="text-12 text-secondary">Recommended 512×512px. PNG or JPG.</p>
          <input
            id="logo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  )
}

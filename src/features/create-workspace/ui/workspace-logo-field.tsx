import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Label } from '@/shared/ui/primitives/label'

type LogoValidationError =
  | { kind: 'SIZE_EXCEEDED'; maxBytes: number }
  | { kind: 'INVALID_MIME'; mimeType: string }

const MAX_LOGO_SIZE = 2 * 1024 * 1024
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp']

function validateLogo(file: File): LogoValidationError | null {
  if (file.size > MAX_LOGO_SIZE) {
    return { kind: 'SIZE_EXCEEDED', maxBytes: MAX_LOGO_SIZE }
  }
  if (!ALLOWED_MIMES.includes(file.type)) {
    return { kind: 'INVALID_MIME', mimeType: file.type }
  }
  return null
}

interface WorkspaceLogoFieldProps {
  value: File | null
  onChange: (file: File | null) => void
}

export function WorkspaceLogoField({ value, onChange }: WorkspaceLogoFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateLogo(file)
    if (validationError) {
      const message =
        validationError.kind === 'SIZE_EXCEEDED'
          ? 'Logo size exceeds 2MB limit'
          : `File type ${validationError.mimeType} is not allowed`
      toast.error(message)
      return
    }

    onChange(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    onChange(null)
  }

  const previewUrl = value ? URL.createObjectURL(value) : null
  const initials = value ? 'WS' : ''

  return (
    <div className="space-y-3">
      <Label className="text-14 font-medium">Workspace Logo</Label>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Avatar className="h-[72px] w-[72px] rounded-xl border border-subtle">
            {previewUrl ? (
              <AvatarImage
                src={previewUrl}
                alt="Workspace logo preview"
                className="object-cover rounded-xl"
              />
            ) : (
              <AvatarFallback className="rounded-xl text-18 font-bold bg-layer-2 text-secondary">
                {initials || 'Upload'}
              </AvatarFallback>
            )}
          </Avatar>
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-backdrop rounded-xl">
              <Loader2 className="h-5 w-5 animate-spin text-on-color" />
              <span className="text-10 text-on-color mt-0.5">{progress}%</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          {value ? (
            <button
              type="button"
              onClick={handleRemove}
              className="block text-14 font-semibold text-danger-primary hover:underline"
            >
              Remove
            </button>
          ) : (
            <label
              htmlFor="logo-upload"
              className="block text-14 font-semibold text-accent-primary cursor-pointer hover:underline"
            >
              {isUploading ? 'Uploading...' : 'Upload new Icon'}
            </label>
          )}
          <p className="text-12 text-secondary">Recommended 512×512px. PNG or JPG.</p>
          <input
            id="logo-upload"
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  )
}
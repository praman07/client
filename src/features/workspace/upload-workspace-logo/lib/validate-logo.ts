export type LogoValidationError =
  | { kind: 'SIZE_EXCEEDED'; maxBytes: number }
  | { kind: 'INVALID_MIME'; mimeType: string }

const MAX_LOGO_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function validateLogo(file: File): LogoValidationError | null {
  if (file.size > MAX_LOGO_SIZE) {
    return { kind: 'SIZE_EXCEEDED', maxBytes: MAX_LOGO_SIZE }
  }

  if (!ALLOWED_MIMES.includes(file.type)) {
    return { kind: 'INVALID_MIME', mimeType: file.type }
  }

  return null
}

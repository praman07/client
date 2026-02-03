import { z } from 'zod'

export const renameChannelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Channel name is required')
    .max(100, 'Channel name must be less than 100 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Only lowercase letters, numbers, and dashes allowed',
    ),
})

export type RenameChannelFormData = z.infer<typeof renameChannelSchema>

/**
 * Sanitize channel name input in real-time
 * Converts user input to valid channel name format:
 * - Lowercase
 * - Spaces → dashes
 * - Remove invalid characters
 * - Collapse multiple dashes
 *
 * Note: Does NOT trim leading/trailing dashes during typing
 * (validation will catch this on submit)
 */
export function sanitizeChannelName(value: string): string {
  return value
    .toLowerCase() // Lowercase
    .replace(/\s+/g, '-') // Spaces → dashes
    .replace(/[^a-z0-9-]/g, '') // Remove invalid chars
    .replace(/-{2,}/g, '-') // Collapse 2+ consecutive dashes to 1
}

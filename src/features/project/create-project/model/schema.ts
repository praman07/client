import { z } from 'zod'
import { RESERVED_SLUGS } from './constants'
import type { ZodType } from 'zod'

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(64, 'Slug must be at most 64 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric (a-z, 0-9, -)')
    .refine((val) => !RESERVED_SLUGS.includes(val as any), {
      message: 'This slug is reserved',
    }),
  workspaceId: z.string().cuid(),
})

// Helper for Zod validation
export const validateZod =
  (schema: ZodType<any>) =>
  ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value)
    if (!result.success) {
      return result.error.issues.map((e) => e.message).join(', ')
    }
    return undefined
  }

// Helper for sanitizing slug input
export const sanitizeSlug = (value: string) => {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric chars (except -)
    .replace(/-+/g, '-') // Collapse multiple -
}

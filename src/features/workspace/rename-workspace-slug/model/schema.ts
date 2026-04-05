import { z } from 'zod'
import { RESERVED_SLUGS } from '@/shared/config/limits'

export const slugRenameSchema = z.object({
  slug: z
    .string()
    .min(8, 'Slug must be at least 8 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(
      /^(?![0-9]+$)[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase, alphanumeric.',
    )
    .refine((val) => !(RESERVED_SLUGS as ReadonlyArray<string>).includes(val), {
      message: 'This slug is reserved for system use',
    })
    .transform((s) => s.toLowerCase()),
})

export type SlugRenameInput = z.infer<typeof slugRenameSchema>

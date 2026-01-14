import { z } from 'zod'

// Helper type to manage strict TanStack Form generics

import { RESERVED_SLUGS } from '@/shared/config/limits'

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(64, 'Workspace name must be less than 64 characters'),
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
  teamSize: z.enum(['just_me', '1-10', '10-50', '50+']).default('just_me'),
})

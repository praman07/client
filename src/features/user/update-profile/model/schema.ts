import { z } from 'zod'

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be less than 80 characters'),
  bio: z
    .string()
    .trim()
    .max(300, 'Bio must be under 300 characters')
    .optional(),
  timezone: z.string().max(64).optional(),
  language: z.string().max(10).optional(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

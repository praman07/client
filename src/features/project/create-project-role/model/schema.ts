import { z } from 'zod'

export const createProjectRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(30, 'Role name must be less than 30 characters')
    .trim(),
  rank: z
    .number()
    .int()
    .min(1, 'Rank must be at least 1')
    .max(99, 'Rank must be at most 99'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
})

export type CreateProjectRoleFormValues = z.infer<
  typeof createProjectRoleSchema
>

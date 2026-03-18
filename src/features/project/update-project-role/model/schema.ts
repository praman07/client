import { z } from 'zod'

export const updateProjectRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(30, 'Role name must be less than 30 characters')
    .trim()
    .optional(),
  rank: z.number().int().min(1).max(99).optional(),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
})

export type UpdateProjectRoleFormValues = z.infer<
  typeof updateProjectRoleSchema
>

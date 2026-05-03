import { z } from 'zod'

export const createProjectRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(64),
  description: z.string().max(255).optional(),
  rank: z.number().int().min(1).max(100),
})

export type CreateProjectRoleInput = z.infer<typeof createProjectRoleSchema>
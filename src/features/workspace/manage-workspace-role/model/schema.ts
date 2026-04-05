import { z } from 'zod'

export const createWorkspaceRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(64),
  description: z.string().max(255).optional(),
  rank: z.number().int().min(1).max(100),
})

export const updateWorkspaceRoleSchema = createWorkspaceRoleSchema.partial()

export type CreateWorkspaceRoleInput = z.infer<typeof createWorkspaceRoleSchema>
export type UpdateWorkspaceRoleInput = z.infer<typeof updateWorkspaceRoleSchema>

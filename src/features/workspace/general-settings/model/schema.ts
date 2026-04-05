import { z } from 'zod'

export const updateWorkspaceProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(64, 'Name too long'),
})

export type UpdateWorkspaceProfileInput = z.infer<typeof updateWorkspaceProfileSchema>

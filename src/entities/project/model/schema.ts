import { z } from 'zod'

// Place generic project schemas here if needed (e.g. for updates)
// Currently mostly handled by Features (CreateProject) but entity layer should handle updates.

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
})

export type UpdateProjectValues = z.infer<typeof updateProjectSchema>

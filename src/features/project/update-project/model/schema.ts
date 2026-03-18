import { z } from 'zod'

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
})

export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>

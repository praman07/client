import { z } from 'zod'

export const updateDescriptionSchema = z.object({
  boardId: z.string().cuid(),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
})

export type UpdateDescriptionFormData = z.infer<typeof updateDescriptionSchema>

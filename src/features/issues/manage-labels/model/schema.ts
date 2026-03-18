import { z } from 'zod'

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #6B7280)')

export const createLabelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  color: hexColor.default('#6B7280'),
})

export const updateLabelSchema = createLabelSchema.partial()

export type CreateLabelFormData = z.infer<typeof createLabelSchema>
export type UpdateLabelFormData = z.infer<typeof updateLabelSchema>

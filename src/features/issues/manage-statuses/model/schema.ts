import { z } from 'zod'

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #6B7280)')

export const createStatusSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  color: hexColor.default('#6B7280'),
  icon: z.string().nullable().optional(),
})

export const updateStatusSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: hexColor.optional(),
  icon: z.string().nullable().optional(),
})

export type CreateStatusFormData = z.infer<typeof createStatusSchema>
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>

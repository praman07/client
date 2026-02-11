import { z } from 'zod'

export const createBoardSchema = z.object({
  workspaceId: z.string().cuid(),
  projectId: z.string().cuid().optional(),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  // Note: collaboratorIds omitted for initial implementation
  // Can be added later as advanced feature
})

export type CreateBoardFormData = z.infer<typeof createBoardSchema>

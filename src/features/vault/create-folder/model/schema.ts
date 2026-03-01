import { z } from 'zod'

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, 'Folder name is required')
    .max(255, 'Name must be less than 255 characters')
    .trim(),
})

export type CreateFolderFormData = z.infer<typeof createFolderSchema>

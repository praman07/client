import { z } from 'zod'

export const createChannelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Channel name is required')
    .max(100, 'Channel name must be less than 100 characters'),
  topic: z
    .string()
    .trim()
    .max(500, 'Topic must be less than 500 characters')
    .optional(),
  type: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
})

export type CreateChannelFormValues = z.infer<typeof createChannelSchema>

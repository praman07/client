import { z } from 'zod'

export const createChannelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Channel name is required')
    .max(80, 'Channel name must be less than 80 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Channel name must be lowercase, numbers, and dashes only',
    ),
  topic: z
    .string()
    .trim()
    .max(500, 'Topic must be less than 500 characters')
    .optional(),
  type: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
})

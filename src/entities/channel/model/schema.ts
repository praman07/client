import { z } from 'zod'

export const ChannelTypeSchema = z.enum(['PUBLIC', 'PRIVATE', 'DM'])

export const ChannelSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  projectId: z.string(),
  type: ChannelTypeSchema,
  name: z.string().optional(),
  topic: z.string().optional(),
  isArchived: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().optional(),
  memberCount: z.number().int().nonnegative(),
})

export type Channel = z.infer<typeof ChannelSchema>
export type ChannelType = z.infer<typeof ChannelTypeSchema>

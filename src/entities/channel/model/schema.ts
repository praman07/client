import { z } from 'zod'

export const ChannelTypeSchema = z.enum(['PROJECT', 'DM', 'GROUP_DM'])

export const ChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: ChannelTypeSchema,
  projectId: z.string(),
  memberCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string(),
  isArchived: z.boolean().default(false),
  lastSyncedAt: z.string().datetime().optional(),
})

export type Channel = z.infer<typeof ChannelSchema>
export type ChannelType = z.infer<typeof ChannelTypeSchema>

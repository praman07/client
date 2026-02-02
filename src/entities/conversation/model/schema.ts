import { z } from 'zod'

/**
 * Zod schema for conversation type enum
 */
export const conversationTypeSchema = z.enum([
  'CHANNEL',
  'DM',
  'GROUP_DM',
  'THREAD',
])

/**
 * Zod schema for conversation validation
 */
export const conversationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  topic: z.string().nullable(),
  type: conversationTypeSchema,
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid().nullable(),
  isPublic: z.boolean(),
  isArchived: z.boolean(),
  memberCount: z.number().int().min(0),
  unreadCount: z.number().int().min(0).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type ConversationInputSchema = z.infer<typeof conversationSchema>

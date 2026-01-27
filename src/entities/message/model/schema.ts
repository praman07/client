import { z } from 'zod'
import { ReactionSchema } from '@/entities/reaction/model/schema'

export const MessageDeliveryStatusSchema = z.enum([
  'pending',
  'sent',
  'delivered',
  'read',
  'failed',
])

export const MessageSchema = z.object({
  id: z.string(), // Server ID or Optimistic ID
  streamId: z.string().optional(), // Redis Sequence ID
  conversationId: z.string(),
  content: z.string(), // Rich text or plain string
  authorId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  deletedAt: z.string().datetime().optional(),

  // Relations
  reactions: z.array(ReactionSchema).default([]),
  threadId: z.string().optional(),
  replyCount: z.number().int().nonnegative().default(0),

  // UI / Optimistic State
  optimisticId: z.string().optional(),
  deliveryStatus: MessageDeliveryStatusSchema.default('sent'),
  isGapFiller: z.boolean().optional(),
})

export type Message = z.infer<typeof MessageSchema>
export type MessageDeliveryStatus = z.infer<typeof MessageDeliveryStatusSchema>

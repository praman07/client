import { z } from 'zod'

export const ReactionSchema = z.object({
  emoji: z.string(),
  count: z.number().int().nonnegative(),
  hasReacted: z.boolean(), // "Me" check
  authorIds: z.array(z.string()).optional(), // Optional list of reactors
})

export type ReactionGroup = z.infer<typeof ReactionSchema>

import { z } from 'zod'

export const OrphanMentionsSchema = z.object({
  targetEntityId: z.string().min(1),
})

export type OrphanMentionsInput = z.infer<typeof OrphanMentionsSchema>

export function validateOrphanMentions(input: unknown): OrphanMentionsInput {
  return OrphanMentionsSchema.parse(input)
}

import { z } from 'zod'
import type { CreateMentionInput } from '@/gql/graphql'

export const CreateMentionInputSchema = z.object({
  sourceEntityId: z.string().min(1),
  sourceEntityType: z.string().min(1),
  targetEntityId: z.string().min(1),
  targetEntityType: z.string().min(1),
  displayText: z.string().min(1).max(500),
  sourceLocation: z.record(z.string(), z.unknown()).optional(),
})

export const CreateMentionsSchema = z.array(CreateMentionInputSchema).min(1).max(50)

export type CreateMentionsInput = z.infer<typeof CreateMentionsSchema>
export type { CreateMentionInput }

export function validateCreateMentions(input: unknown): CreateMentionsInput {
  return CreateMentionsSchema.parse(input)
}

import { z } from 'zod'

export const DeleteMentionsSchema = z.array(z.string()).min(1).max(100)

export type DeleteMentionsInput = z.infer<typeof DeleteMentionsSchema>

export function validateDeleteMentions(input: unknown): DeleteMentionsInput {
  return DeleteMentionsSchema.parse(input)
}

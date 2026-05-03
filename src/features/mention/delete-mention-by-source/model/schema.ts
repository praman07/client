import { z } from 'zod'

export const DeleteMentionsBySourceSchema = z.object({
  sourceEntityId: z.string().min(1),
})

export type DeleteMentionsBySourceInput = z.infer<typeof DeleteMentionsBySourceSchema>

export function validateDeleteMentionsBySource(input: unknown): DeleteMentionsBySourceInput {
  return DeleteMentionsBySourceSchema.parse(input)
}

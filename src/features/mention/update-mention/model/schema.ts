import { z } from 'zod'

export const UpdateMentionInputSchema = z.object({
  mentionId: z.string().min(1),
  displayText: z.string().min(1).max(500).optional(),
  sourceLocation: z.record(z.string(), z.unknown()).optional(),
})

export type UpdateMentionInput = z.infer<typeof UpdateMentionInputSchema>

export function validateUpdateMention(input: unknown): UpdateMentionInput {
  return UpdateMentionInputSchema.parse(input)
}

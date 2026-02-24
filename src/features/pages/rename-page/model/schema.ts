import { z } from 'zod'
import type { ZodType } from 'zod'

export const renamePageSchema = z.object({
  title: z
    .string()
    .min(1, 'Page name is required')
    .max(500, 'Name must be less than 500 characters')
    .trim(),
})

export type RenamePageFormData = z.infer<typeof renamePageSchema>

/** Shared Zod field validator for TanStack Form validators.onChange */
export const validateZod =
  (schema: ZodType<any>) =>
  ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value)
    if (!result.success) {
      return result.error.issues.map((e) => e.message).join(', ')
    }
    return undefined
  }

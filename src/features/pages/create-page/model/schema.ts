import { z } from 'zod'
import type { ZodType } from 'zod'

/**
 * Form-visible fields only.
 * workspaceId / projectId / parentId / position are supplied by the caller.
 */
export const createPageSchema = z.object({
  title: z
    .string()
    .min(1, 'Page name is required')
    .max(500, 'Name must be less than 500 characters')
    .trim(),
  icon: z.string().max(10, 'Icon must be a single emoji').optional(),
})

export type CreatePageFormData = z.infer<typeof createPageSchema>

/** Shared Zod field validator for use with TanStack Form validators.onChange */
export const validateZod =
  (schema: ZodType<any>) =>
  ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value)
    if (!result.success) {
      return result.error.issues.map((e) => e.message).join(', ')
    }
    return undefined
  }

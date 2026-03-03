import { z } from 'zod'

/**
 * Zod schema for the create issue form.
 * All fields except title and statusId are optional.
 * @layer Features
 */
export const createIssueSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(500, 'Title must be less than 500 characters')
    .trim(),
  statusId: z.string().min(1, 'Status is required'),
  priority: z
    .enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW', 'NO_PRIORITY'])
    .default('NO_PRIORITY'),
  assigneeId: z.string().nullable().optional(),
  labelIds: z.array(z.string()).default([]),
  dueDate: z.string().nullable().optional(),
})

export type CreateIssueFormData = z.infer<typeof createIssueSchema>

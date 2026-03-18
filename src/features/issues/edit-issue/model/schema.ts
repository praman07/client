import { z } from 'zod'

/**
 * All fields optional — only mutated fields are sent to updateIssue.
 * @layer Features
 */
export const updateIssueSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  priority: z
    .enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW', 'NO_PRIORITY'])
    .optional(),
  assigneeId: z.string().nullable().optional(),
  labelIds: z.array(z.string()).optional(),
  dueDate: z.string().nullable().optional(),
})

export type UpdateIssueFormData = z.infer<typeof updateIssueSchema>

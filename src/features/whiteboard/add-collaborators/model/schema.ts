import { z } from 'zod'

export const addCollaboratorsSchema = z.object({
  boardId: z.string().cuid(),
  userIds: z
    .array(z.string())
    .min(1, 'Select at least one user')
    .max(50, 'Cannot add more than 50 collaborators at once'),
})

export type AddCollaboratorsFormData = z.infer<typeof addCollaboratorsSchema>

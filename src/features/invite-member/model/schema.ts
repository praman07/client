import { z } from 'zod'

export const inviteMemberSchema = z.object({
  emails: z
    .array(z.object({ email: z.string().email('Invalid email address') }))
    .min(1, 'At least one email is required')
    .max(10, 'You can invite max 10 people at once'),
  roleId: z.string().min(1, 'Please select a role'),
})

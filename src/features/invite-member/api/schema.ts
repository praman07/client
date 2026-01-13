import { z } from 'zod'

import type { ReactFormApi } from '@tanstack/react-form'

export const inviteMemberSchema = z.object({
  emails: z
    .array(z.object({ email: z.string().email('Invalid email address') }))
    .min(1, 'At least one email is required')
    .max(10, 'You can invite max 10 people at once'),
})

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>

export type InviteMemberFormApi = ReactFormApi<
  InviteMemberFormValues,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

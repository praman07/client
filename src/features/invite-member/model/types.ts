import type { inviteMemberSchema } from './schema'
import type { z } from 'zod'
import type { ReactFormApi } from '@tanstack/react-form'

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

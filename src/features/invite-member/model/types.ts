import { z } from 'zod'
import type { ReactFormApi } from '@tanstack/react-form'
import { inviteMemberSchema } from './schema'

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

import type { ReactFormApi } from '@tanstack/react-form'
import type { z } from 'zod'
import type { createChannelSchema } from './schema'

export type CreateChannelInput = z.infer<typeof createChannelSchema>

export const CHANNEL_TYPES = ['CHANNEL', 'DM', 'GROUP_DM'] as const
export type ChannelType = z.infer<typeof createChannelSchema.shape.type>

export type CreateChannelFormApi = ReactFormApi<
  CreateChannelInput,
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
> & {
  state: { isSubmitting: boolean; values: CreateChannelInput }
  handleSubmit: () => void
}

// Legacy alias
export type ChannelFormApi = CreateChannelFormApi

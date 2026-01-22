import { z } from 'zod'
import { createChannelSchema } from './schema'

export type CreateChannelFormValues = z.infer<typeof createChannelSchema>

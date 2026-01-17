import type { createProjectSchema } from './schema'
import type { z } from 'zod'

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>

export interface CreateProjectModalState {
  isOpen: boolean
}

import type { createPageSchema } from './schema'
import type { z } from 'zod'

/** Inferred form state type — derived from schema, not FormApi */
export type CreatePageFormValues = z.infer<typeof createPageSchema>

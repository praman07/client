import type { z } from 'zod'
import type { ReactFormApi } from '@tanstack/react-form'
import type { createWorkspaceSchema } from './schema'

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>

export type WorkspaceFormApi = ReactFormApi<
  CreateWorkspaceInput,
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
> & { state: { isSubmitting: boolean; values: CreateWorkspaceInput } }

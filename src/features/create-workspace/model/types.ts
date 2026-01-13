import { z } from 'zod'
import { ReactFormApi } from '@tanstack/react-form'
import { createWorkspaceSchema } from './schema'

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

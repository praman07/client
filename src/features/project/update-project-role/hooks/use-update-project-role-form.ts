import { useForm } from '@tanstack/react-form'
import {
  
  updateProjectRoleSchema
} from '../model/schema'
import { handleUpdateProjectRoleError } from '../lib/error-mapping'
import { closeUpdateRoleDialog } from '../model/slice'
import { useUpdateProjectRole } from './use-update-project-role'
import type { ZodIssue, ZodType } from 'zod'
import type {UpdateProjectRoleFormValues} from '../model/schema';
import { useAppDispatch } from '@/shared/hooks'

function validateZod(schema: ZodType<unknown>) {
  return ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value)
    if (!result.success) {
      return result.error.issues.map((e: ZodIssue) => e.message).join(', ')
    }
    return undefined
  }
}

interface UseUpdateProjectRoleFormProps {
  roleId: string
  projectId: string
  workspaceId: string
  defaultValues: UpdateProjectRoleFormValues
  onSuccess?: () => void
}

export function useUpdateProjectRoleForm({
  roleId,
  projectId,
  workspaceId,
  defaultValues,
  onSuccess,
}: UseUpdateProjectRoleFormProps) {
  const { mutate: updateRole, isPending } = useUpdateProjectRole()
  const dispatch = useAppDispatch()

  const form = useForm({
    defaultValues,
    validators: { onChange: validateZod(updateProjectRoleSchema) },
    onSubmit: ({ value }) => {
      updateRole(
        { roleId, projectId, workspaceId, ...value },
        {
          onSuccess: () => {
            dispatch(closeUpdateRoleDialog())
            onSuccess?.()
          },
          onError: handleUpdateProjectRoleError,
        },
      )
    },
  })

  return { form, isPending }
}

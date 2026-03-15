import { useForm } from '@tanstack/react-form'
import {
  updateProjectRoleSchema,
  type UpdateProjectRoleFormValues,
} from '../model/schema'
import { useUpdateProjectRole } from './use-update-project-role'
import { handleUpdateProjectRoleError } from '../lib/error-mapping'
import { closeUpdateRoleDialog } from '../model/slice'
import { useAppDispatch } from '@/shared/hooks'

function validateZod(schema: any) {
  return ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value)
    if (!result.success) {
      return result.error.issues.map((e: any) => e.message).join(', ')
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

import { useForm } from '@tanstack/react-form'
import {
  updateProjectSchema,
  type UpdateProjectFormValues,
} from '../model/schema'
import { useUpdateProject } from './use-update-project'
import { handleUpdateProjectError } from '../lib/error-mapping'

function validateZod(schema: any) {
  return ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value)
    if (!result.success) {
      return result.error.issues.map((e: any) => e.message).join(', ')
    }
    return undefined
  }
}

interface UseUpdateProjectFormProps {
  projectId: string
  workspaceId: string
  defaultValues: UpdateProjectFormValues
  onSuccess?: () => void
}

export function useUpdateProjectForm({
  projectId,
  workspaceId,
  defaultValues,
  onSuccess,
}: UseUpdateProjectFormProps) {
  const { mutate: updateProject, isPending } = useUpdateProject(
    projectId,
    workspaceId,
  )

  const form = useForm({
    defaultValues,
    validators: { onChange: validateZod(updateProjectSchema) },
    onSubmit: ({ value }) => {
      updateProject(value, { onSuccess, onError: handleUpdateProjectError })
    },
  })

  return { form, isPending }
}

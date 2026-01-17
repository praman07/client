import { useForm } from '@tanstack/react-form'

import { createProjectSchema, sanitizeSlug, validateZod } from '../model/schema'
import { handleCreateProjectError } from '../lib/error-mapping'
import { useCheckSlug } from './use-check-slug'
import { useCreateProject } from './use-create-project'

interface UseCreateProjectFormProps {
  workspaceId: string
  onSuccess?: () => void
}

export function useCreateProjectForm({
  workspaceId,
  onSuccess,
}: UseCreateProjectFormProps) {
  const { mutate: createProject, isPending: isCreating } = useCreateProject()
  const { checkSlug } = useCheckSlug()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      workspaceId,
    },
    validators: {
      onChange: validateZod(createProjectSchema),
    },
    onSubmit: ({ value }) => {
      createProject(value, {
        onSuccess,
        onError: (error) => handleCreateProjectError(error),
      })
    },
  })

  const handleNameChange = (name: string) => {
    form.setFieldValue('name', name)
    const currentSlug = form.getFieldValue('slug')
    if (!currentSlug || sanitizeSlug(name).startsWith(currentSlug)) {
      form.setFieldValue('slug', sanitizeSlug(name))
    }
  }

  return {
    form,
    isCreating,
    checkSlug,
    handleNameChange,
  }
}

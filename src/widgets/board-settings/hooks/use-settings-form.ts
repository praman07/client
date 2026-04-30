import { useForm } from '@tanstack/react-form'

interface UseSettingsFormOptions {
  defaultName?: string
  defaultDescription?: string
}

/**
 * Hook managing board settings form state
 *
 * Uses TanStack Form for validation and state management
 */
export function useSettingsForm({
  defaultName = '',
  defaultDescription = '',
}: UseSettingsFormOptions) {
  const form = useForm({
    defaultValues: {
      name: defaultName,
      description: defaultDescription,
    },
  })

  return form
}

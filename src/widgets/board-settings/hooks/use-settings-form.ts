import { useForm } from 'react-hook-form'

interface BoardFormData {
  name: string
  description: string
}

interface UseSettingsFormOptions {
  defaultName?: string
  defaultDescription?: string
}

/**
 * Hook managing board settings form state
 *
 * Uses react-hook-form for validation and state management
 */
export function useSettingsForm({
  defaultName = '',
  defaultDescription = '',
}: UseSettingsFormOptions) {
  const form = useForm<BoardFormData>({
    defaultValues: {
      name: defaultName,
      description: defaultDescription,
    },
  })

  return form
}

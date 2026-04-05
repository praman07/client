import { useMutation } from '@tanstack/react-query'
import { CHECK_SLUG_AVAILABILITY_MUTATION } from '@/entities/workspace'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useCheckSlugAvailability() {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (slug: string) => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(CHECK_SLUG_AVAILABILITY_MUTATION, { slug })
      return data.checkSlugAvailability
    },
  })
}

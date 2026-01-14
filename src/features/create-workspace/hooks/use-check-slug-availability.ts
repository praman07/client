import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { GqlClient } from '@/shared/api/graphql-client'
import { CHECK_SLUG_AVAILABILITY } from '../api'

export function useCheckSlugAvailability() {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (slug: string) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(CHECK_SLUG_AVAILABILITY, { slug })
    },
  })
}

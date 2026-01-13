import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { createGqlClient } from '@/shared/api/graphql-client'
import { CHECK_SLUG_AVAILABILITY } from '../api'

export function useCheckSlugAvailability() {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (slug: string) => {
      const token = await getToken()
      const client = createGqlClient(token)
      return client.request(CHECK_SLUG_AVAILABILITY, { slug })
    },
  })
}

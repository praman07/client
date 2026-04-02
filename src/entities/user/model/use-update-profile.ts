import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UPDATE_PROFILE_MUTATION } from '../api/mutations'
import { userKeys } from './use-user'
import type { UpdateProfileInput } from '@/gql/graphql'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'

/**
 * useUpdateProfile — mutation hook for updating the current user's profile.
 *
 * On success, invalidates the 'user.me' cache key so any component consuming
 * useUser() automatically reflects the new values.
 */
export function useUpdateProfile() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const token = await getToken()
      return GqlClient(token).request(UPDATE_PROFILE_MUTATION, { input })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

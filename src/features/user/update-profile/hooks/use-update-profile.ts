import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateProfileInput } from '@/gql/graphql'
import { UPDATE_PROFILE_MUTATION } from '@/entities/user/api/mutations'
import { userKeys } from '@/entities/user/model/use-user'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'

/**
 * useUpdateProfile — DB mutation for the update-profile feature.
 *
 * Architecture: Lives in the features layer because it represents a write/action.
 * Invalidates the user.me cache so UI reflects changes immediately.
 */
export function useUpdateProfile() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Omit<UpdateProfileInput, 'userId'>) => {
      const token = await getToken()
      return GqlClient(token).request(UPDATE_PROFILE_MUTATION, { input })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

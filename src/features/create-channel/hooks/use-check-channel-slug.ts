import { useMutation } from '@tanstack/react-query'
import { CHECK_CHANNEL_AVAILABILITY_MUTATION } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

type CheckParams = {
  projectId: string
  slug: string
}

export function useCheckChannelSlug() {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({ projectId, slug }: CheckParams) => {
      const token = await getToken()

      return GqlClient(token).request(CHECK_CHANNEL_AVAILABILITY_MUTATION, {
        input: {
          projectId,
          slug,
        },
      })
    },
  })
}

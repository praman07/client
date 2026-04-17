import { useMutation } from '@tanstack/react-query'
import { ORPHAN_MENTIONS } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useOrphanMentions() {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (targetEntityId: string) => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(ORPHAN_MENTIONS, { targetEntityId })
      return data.orphanMentions as number
    },
  })
}

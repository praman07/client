import { useQuery, useQueryClient } from '@tanstack/react-query'
import { transformEntities } from '../../lib'
import { GET_PROJECT_ENTITIES, projectEntityKeys } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useProjectEntities(projectId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: projectEntityKeys.list(projectId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_PROJECT_ENTITIES, { projectId })
      return transformEntities(data)
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useInvalidateProjectEntities() {
  const queryClient = useQueryClient()

  return (projectId: string) => {
    queryClient.invalidateQueries({
      queryKey: projectEntityKeys.list(projectId),
    })
  }
}

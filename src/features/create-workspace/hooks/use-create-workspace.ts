import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { CREATE_WORKSPACE } from '../api'
import { GqlClient } from '@/shared/api/graphql-client'
import { workspaceKeys } from '@/entities/workspace/api/query-keys'

export function useCreateWorkspace() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { slug: string; name: string }) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(CREATE_WORKSPACE, variables)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.my() })
    },
  })
}

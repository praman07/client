import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { createGqlClient } from '@/shared/api/graphql-client'
import { workspaceKeys } from '@/entities/workspace/api/query-keys'
import { CREATE_WORKSPACE } from '../api'

export function useCreateWorkspace() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { slug: string; name: string }) => {
      const token = await getToken()
      const client = createGqlClient(token)
      return client.request(CREATE_WORKSPACE, variables)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.my() })
    },
  })
}

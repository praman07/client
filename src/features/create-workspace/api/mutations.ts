import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { gql } from '@/gql'
import { createGqlClient } from '@/shared/api/graphql-client'
import { workspaceKeys } from '@/entities/workspace/api/query-keys'

const CREATE_WORKSPACE = gql(`
  mutation CreateWorkspace($slug: String!, $name: String!) {
    createWorkspace(slug: $slug, name: $name) {
      id
      slug
      name
    }
  }
`)

const CHECK_SLUG_AVAILABILITY = gql(`
  mutation CheckSlugAvailability($slug: String!) {
    checkSlugAvailability(slug: $slug) {
      available
      message
    }
  }
`)

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

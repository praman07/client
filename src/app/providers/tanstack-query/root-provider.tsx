import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/tanstack-query/query-client'

export function getContext() {
  return {
    queryClient,
  }
}

export function Provider({
  children,
  client,
}: {
  children: React.ReactNode
  client: QueryClient
}) {
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

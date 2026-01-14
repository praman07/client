import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './app/providers/tanstack-query/root-provider'
import { RouteError } from './shared/ui/error/route-error'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { NotFoundPage } from './pages/not-found'

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,
      auth: undefined!, // Auth will be injected by the provider/server
    },

    defaultPreload: 'intent',
    notFoundMode: 'fuzzy',
    defaultNotFoundComponent: NotFoundPage,
    defaultErrorComponent: RouteError,
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}

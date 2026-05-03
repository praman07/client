import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { NotFoundPage } from '@/pages/not-found'
import ClerkProvider from '@/app/providers/clerk/provider'
import TanStackQueryDevtools from '@/app/providers/tanstack-query/devtools'
import { Toaster } from '@/shared/ui/primitives/sonner'
import { ThemeProvider } from '@/app/providers/theme/theme-provider'
import '@/app/styles/globals.css'
import { env } from '@/shared/config/env'


interface MyRouterContext {
  queryClient: QueryClient
  auth: { getToken: () => Promise<string | null> }
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Collabifyy',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.png',
        type: 'image/png',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function RootComponent() {
  useEffect(() => {
    if (!env.VITE_CLARITY_PROJECT_ID || typeof window === 'undefined') return
    // Microsoft Clarity — session recordings, heatmaps, rage/dead click tracking
    ;(function (c: any, l: Document, a: string, r: string, i: string) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }
      const t = l.createElement(r) as HTMLScriptElement
      t.async = true
      t.src = 'https://www.clarity.ms/tag/' + i
      l.head.appendChild(t)
    })(window, document, 'clarity', 'script', env.VITE_CLARITY_PROJECT_ID)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <ThemeProvider defaultTheme="dark" storageKey="collabify-theme">
            <Outlet />
            <Toaster />
          </ThemeProvider>
            <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}

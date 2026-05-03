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
import appCss from '@/app/styles/globals.css?url'
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
      // Google Fonts — loaded as HTML links so they don't block CSS application
      // (CSS @import url() is render-blocking; HTML link tags are non-blocking)
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap',
      },
      // App CSS — ?url gives the hashed path that TanStack Start SSR puts in the initial HTML
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.png', type: 'image/png' },
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
        {/* Critical CSS — inlined so dark bg is instant, before external CSS loads */}
        <style dangerouslySetInnerHTML={{ __html: 'html,body{background-color:oklch(0.1689 0.0021 230.81);color:oklch(0.9235 0.001733 230.6853)}' }} />
        {/* Direct link — bypasses HeadContent SSR timing issues (TanStack Router #5812) */}
        <link rel="stylesheet" href={appCss} />
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

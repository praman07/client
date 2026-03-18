import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

/**
 * Only isolate the truly standalone, heavy libraries that have no
 * circular cross-dependencies with other node_modules.
 * Returning `undefined` for everything else lets Rollup use its own
 * heuristics, avoiding circular chunk errors.
 */
function manualChunks(id: string): string | undefined {
  if (!id.includes('node_modules')) return undefined

  // Mermaid + its exclusive diagram deps (~3MB total)
  // These are truly isolated — nothing else in the app imports them directly
  if (
    id.includes('/mermaid/') ||
    id.includes('/mermaid-') ||
    id.includes('/elkjs/') ||
    id.includes('/cytoscape/') ||
    id.includes('/dagre-d3-es/') ||
    id.includes('/cose-base/') ||
    id.includes('/layout-base/')
  ) {
    return 'vendor-mermaid'
  }

  // Excalidraw canvas (~4.3MB) — only loaded in whiteboard route
  if (
    id.includes('@excalidraw/excalidraw/') ||
    id.includes('y-excalidraw') ||
    id.includes('/roughjs/')
  ) {
    return 'vendor-whiteboard'
  }

  // BlockNote rich-text editor (~1.2MB) — only loaded in page/issue editors
  if (id.includes('@blocknote/')) {
    return 'vendor-editor'
  }

  // KaTeX math rendering (~480kB) — only loaded inside BlockNote
  if (id.includes('/katex/')) {
    return 'vendor-katex'
  }

  // Let Rollup decide everything else naturally
  return undefined
}

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],

  build: {
    // Raise warning threshold — some vendor bundles (Mermaid, Excalidraw)
    // are intentionally large and can't be split further without dynamic import
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },

  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})

export default config

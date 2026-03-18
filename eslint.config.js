//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import boundaries from 'eslint-plugin-boundaries'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  ...tanstackConfig,
  {
    ignores: [
      '.output/**',
      '.tanstack/**',
      'node_modules/**',
      'src/shared/api/graphql/generated/**',
      'src/routeTree.gen.ts',
    ],
  },
  {
    plugins: {
      boundaries,
      'react-hooks': reactHooks,
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'routes', pattern: 'src/routes' },
        { type: 'pages', pattern: 'src/pages' },
        { type: 'widgets', pattern: 'src/widgets' },
        { type: 'features', pattern: 'src/features' },
        { type: 'entities', pattern: 'src/entities' },
        { type: 'shared', pattern: 'src/shared' },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // Shared can only import shared (and external)
            { from: 'shared', allow: ['shared'] },
            // Entities can import shared and entities
            { from: 'entities', allow: ['shared', 'entities'] },
            // Features can import shared, entities, and other features (horizontal composition)
            { from: 'features', allow: ['shared', 'entities', 'features'] },
            // Widgets can import everything below
            {
              from: 'widgets',
              allow: ['shared', 'entities', 'features', 'widgets'],
            },
            // Pages can import everything below widgets
            {
              from: 'pages',
              allow: ['shared', 'entities', 'features', 'widgets'],
            },
            // Routes can import everything below
            {
              from: 'routes',
              allow: ['shared', 'entities', 'features', 'widgets', 'pages', 'routes'],
            },
            // App can import everything
            {
              from: 'app',
              allow: [
                'shared',
                'entities',
                'features',
                'widgets',
                'pages',
                'routes',
                'app',
              ],
            },
          ],
        },
      ],
    },
  },
  {
    // Enforce Public API — cross-slice imports must go through the slice barrel (index.ts)
    // This does NOT restrict imports within the same slice.
    // Exception: app/store/config.ts uses default imports from slices directly (Redux reducers
    // are default exports — `export *` cannot forward them, so the barrel path won't work).
    ignores: ['src/app/store/config.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // entities deep imports: @/entities/foo/model/... or @/entities/foo/api/... etc
              group: ['@/entities/*/*/**', '@/entities/*/model/**', '@/entities/*/api/**', '@/entities/*/ui/**', '@/entities/*/hooks/**', '@/entities/*/lib/**'],
              message: 'Use the entity public API instead: import from @/entities/<name>',
            },
            {
              // features deep imports: @/features/domain/slice/hooks/... or @/features/domain/slice/ui/...
              group: ['@/features/*/*/hooks/**', '@/features/*/*/ui/**', '@/features/*/*/api/**', '@/features/*/*/model/**', '@/features/*/*/lib/**'],
              message: 'Use the feature public API instead: import from @/features/<domain>/<name>',
            },
            {
              // widgets deep imports: @/widgets/foo/hooks/... etc
              group: ['@/widgets/*/hooks/**', '@/widgets/*/ui/**', '@/widgets/*/lib/**', '@/widgets/*/model/**'],
              message: 'Use the widget public API instead: import from @/widgets/<name>',
            },
          ],
        },
      ],
    },
  },
]

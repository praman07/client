//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import boundaries from 'eslint-plugin-boundaries'

export default [
  ...tanstackConfig,
  {
    ignores: [
      '.output/**',
      '.tanstack/**',
      'node_modules/**',
      'src/shared/api/graphql/generated/**',
    ],
  },
  {
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'routes', pattern: 'src/routes' },
        { type: 'widgets', pattern: 'src/widgets' },
        { type: 'features', pattern: 'src/features' },
        { type: 'entities', pattern: 'src/entities' },
        { type: 'shared', pattern: 'src/shared' },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // Shared can only import shared (and external)
            { from: 'shared', allow: ['shared'] },
            // Entities can import shared and entities
            { from: 'entities', allow: ['shared', 'entities'] },
            // Features can import shared and entities (NOT other features)
            { from: 'features', allow: ['shared', 'entities'] },
            // Widgets can import everything below
            {
              from: 'widgets',
              allow: ['shared', 'entities', 'features', 'widgets'],
            },
            // Routes can import everything below
            {
              from: 'routes',
              allow: ['shared', 'entities', 'features', 'widgets', 'routes'],
            },
            // App can import everything
            {
              from: 'app',
              allow: [
                'shared',
                'entities',
                'features',
                'widgets',
                'routes',
                'app',
              ],
            },
          ],
        },
      ],
    },
  },
]

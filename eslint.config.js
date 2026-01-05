//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

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
]

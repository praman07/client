import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: [
    'src/**/*.tsx',
    'src/**/*.ts',
    'src/**/*.graphql',
    '!src/gql/**/*',
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/shared/api/graphql/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config

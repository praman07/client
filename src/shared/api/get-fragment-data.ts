import { useFragment } from '@/gql'

/**
 * Non-hook alias for `useFragment`. Use this inside callbacks, queryFns,
 * or any non-React scope where calling a 'use*' name triggers rules-of-hooks.
 * Semantics are identical — it is a pure type-cast with no side-effects.
 * 
 * We place it here instead of in \`src/gql\` because the entire \`src/gql\`
 * directory is overwritten during \`pnpm gen\` by graphql-codegen.
 */
export { useFragment as getFragmentData }

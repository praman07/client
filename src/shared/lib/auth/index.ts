/**
 * Auth library barrel export.
 *
 * Public API for the authorization subsystem:
 *   - AuthorizationProvider: wrap workspace routes to enable auth context
 *   - usePermission: check a single permission string
 *   - useFeatureFlag: check a feature flag key
 *   - Guard: declarative permission gate component
 *   - FeatureGuard: declarative feature flag gate component
 *   - useAuthorizationContext: raw context access (use sparingly)
 */
export {
  AuthorizationContext,
  AuthorizationProvider,
  useAuthorizationContext,
} from './authorization-provider'
export { usePermission } from './use-permission'
export { useFeatureFlag } from './use-feature-flag'
export { Guard } from './guard'
export { FeatureGuard } from './feature-guard'
export type { AuthScopeContext } from './auth-context'
export type { AppPermission } from './app-permission'

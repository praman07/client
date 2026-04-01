/**
 * Auth WS downstream event strings — server → client.
 *
 * Single source of truth for event names used by auth-plugin.
 * Mirrors the pattern of ChatDownstreamEvent / WhiteboardDownstreamEvent.
 *
 * @layer Shared
 * @module contracts/auth
 */
export enum AuthDownstreamEvent {
  AuthInvalidated  = 'auth.invalidated',
  FlagsInvalidated = 'flags.invalidated',
  PluginUpdated    = 'project.plugin.updated',
}

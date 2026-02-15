export { WhiteboardCanvas } from './ui/canvas'
export { WhiteboardCanvasV2 } from './ui/canvas-v2'

// Re-export hooks for page-level usage if needed
export {
  useNetworkSync,
  useCanvasLifecycle,
  useReadOnlyMode,
  useCollaborativeCursors,
} from './hooks'

// V2 Offline-First Hooks
export { useYDocInstance } from './hooks/use-ydoc-instance'
export { useExcalidrawBinding } from './hooks/use-excalidraw-binding'

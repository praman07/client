import type { WorkspacePartial } from './types'

interface WorkspaceStateShape {
  workspace: {
    myWorkspaces: Array<WorkspacePartial>
    currentWorkspaceId: string | null
  }
}

export const selectMyWorkspaces = (state: WorkspaceStateShape) =>
  state.workspace.myWorkspaces

export const selectCurrentWorkspaceId = (state: WorkspaceStateShape) =>
  state.workspace.currentWorkspaceId

export const selectCurrentWorkspace = (state: WorkspaceStateShape) => {
  const workspaces = state.workspace.myWorkspaces
  const currentId = state.workspace.currentWorkspaceId
  return workspaces.find((w) => w.id === currentId) || null
}

export const selectWorkspaceBySlug = (
  state: WorkspaceStateShape,
  slug?: string,
) => {
  if (!slug) return null
  return state.workspace.myWorkspaces.find((w) => w.slug === slug) || null
}

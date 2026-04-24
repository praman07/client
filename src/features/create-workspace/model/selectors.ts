interface CreateWorkspaceStateShape {
  createWorkspace: {
    step: number
    formData: {
      name: string
      slug: string
      logoUrl?: string
    }
  }
}

export const selectCreateWorkspaceStep = (state: CreateWorkspaceStateShape) =>
  state.createWorkspace.step

export const selectCreateWorkspaceFormData = (
  state: CreateWorkspaceStateShape,
) => state.createWorkspace.formData

interface CreateWorkspaceStateShape {
  createWorkspace: {
    step: number
    formData: {
      name: string
      slug: string
      logoUrl?: string
      teamSize?: 'just_me' | '1-10' | '10-50' | '50+'
    }
  }
}

export const selectCreateWorkspaceStep = (state: CreateWorkspaceStateShape) =>
  state.createWorkspace.step

export const selectCreateWorkspaceFormData = (
  state: CreateWorkspaceStateShape,
) => state.createWorkspace.formData

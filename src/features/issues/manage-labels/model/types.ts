export interface CreateLabelVariables {
  projectId: string
  name: string
  color: string
}

export interface UpdateLabelVariables {
  labelId: string
  name?: string
  color?: string
}

export interface DeleteLabelVariables {
  labelId: string
}

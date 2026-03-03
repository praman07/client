export interface CreateStatusVariables {
  projectId: string
  name: string
  color: string
  icon?: string | null
}

export interface UpdateStatusVariables {
  statusId: string
  name?: string
  color?: string
  icon?: string | null
}

export interface DeleteStatusVariables {
  statusId: string
}

export interface ReorderStatusVariables {
  statusId: string
  newPosition: number
}

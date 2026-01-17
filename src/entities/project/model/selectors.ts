import type { Project } from './types'

interface ProjectStateShape {
  project: {
    currentProject: Project | null
    recentProjects: Array<Project>
  }
}

export const selectCurrentProject = (state: ProjectStateShape) =>
  state.project.currentProject

export const selectRecentProjects = (state: ProjectStateShape) =>
  state.project.recentProjects

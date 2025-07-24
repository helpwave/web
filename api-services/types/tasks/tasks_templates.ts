import type { SubtaskDTO } from './task'

export type TaskTemplateDTO = {
  wardId?: string,
  id: string,
  name: string,
  notes: string,
  subtasks: SubtaskDTO[],
  isPublicVisible: boolean,
  creatorId: string,
}

export const emptyTaskTemplate: TaskTemplateDTO = {
  id: '',
  isPublicVisible: false,
  name: '',
  notes: '',
  subtasks: [],
  creatorId: ''
}

export type TaskTemplateFormType = {
  isValid: boolean,
  hasChanges: boolean,
  template: TaskTemplateDTO,
  wardId?: string,
  deletedSubtaskIds?: string[],
}

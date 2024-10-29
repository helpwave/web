export type TaskTemplateDTO = {
  wardId?: string,
  id: string,
  name: string,
  notes: string,
  subtasks: {
    isDone: boolean,
    id: string,
    name: string
  }[],
  isPublicVisible: boolean
}

export const emptyTaskTemplate: TaskTemplateDTO = {
  id: '',
  isPublicVisible: false,
  name: '',
  notes: '',
  subtasks: []
}

export type TaskTemplateFormType = {
  isValid: boolean,
  hasChanges: boolean,
  template: TaskTemplateDTO,
  wardId?: string,
  deletedSubtaskIds?: string[]
}

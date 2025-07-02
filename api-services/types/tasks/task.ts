import type { Translation } from '@helpwave/hightide'

export type SubTaskDTO = {
  id: string,
  name: string,
  isDone: boolean,
}

export type CreateSubTaskDTO = SubTaskDTO & {
  taskId?: string,
}

const taskStatus = ['done', 'inProgress', 'todo'] as const

export type TaskStatus = typeof taskStatus[number]

export type TaskStatusTranslationType = Record<TaskStatus, string>

const taskStatusTranslation: Translation<TaskStatusTranslationType> = {
  en: {
    todo: 'Todo',
    inProgress: 'In Progress',
    done: 'Done'
  },
  de: {
    todo: 'Todo',
    inProgress: 'In Arbeit',
    done: 'Fertig'
  }
}
export const TaskStatusUtil = {
  taskStatus,
  translation: taskStatusTranslation
}

export type TaskDTO = {
  id: string,
  name: string,
  assignee?: string,
  notes: string,
  status: TaskStatus,
  subtasks: SubTaskDTO[],
  dueDate?: Date,
  createdAt?: Date,
  creatorId?: string,
  isPublicVisible: boolean,
}

export const emptyTask: TaskDTO = {
  id: '',
  name: '',
  notes: '',
  status: 'todo',
  subtasks: [],
  isPublicVisible: false
}

export type TaskMinimalDTO = {
  id: string,
  name: string,
  status: TaskStatus,
}

export type SortedTasks = Record<TaskStatus, TaskDTO[]>
export const emptySortedTasks: SortedTasks = {
  todo: [],
  inProgress: [],
  done: []
}

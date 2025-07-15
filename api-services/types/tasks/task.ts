import type { Translation } from '@helpwave/hightide'

export type SubTaskDTO = {
  id: string,
  name: string,
  isDone: boolean,
  taskId: string,
}

// The order in the array defines the sorting order
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

type TaskStatusColor = {
  background: string,
  icon: string,
  text: string,
}

const taskColorMapping: Record<TaskStatus, TaskStatusColor> = {
  todo: {
    background: 'bg-todo-background',
    text: 'text-todo-text',
    icon: 'text-todo-icon',
  },
  inProgress: {
    background: 'bg-inprogress-background',
    text: 'text-inprogress-text',
    icon: 'text-inprogress-icon',
  },
  done: {
    background: 'bg-done-background',
    text: 'text-done-text',
    icon: 'text-done-icon',
  },
}

export const TaskStatusUtil = {
  taskStatus,
  translation: taskStatusTranslation,
  compare: (a: TaskStatus, b: TaskStatus): number => {
    return taskStatus.indexOf(a) - taskStatus.indexOf(b)
  },
  colors: taskColorMapping
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
  patientId: string,
  isPublicVisible: boolean,
}

export const emptyTask: TaskDTO = {
  id: '',
  name: '',
  notes: '',
  status: 'todo',
  subtasks: [],
  patientId: '',
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

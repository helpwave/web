export type SubTaskDTO = {
  id: string,
  name: string,
  isDone: boolean
}

export type CreateSubTaskDTO = SubTaskDTO & {
  taskId?: string
}

export type TaskStatus = 'done' | 'inProgress' | 'todo'

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
  isPublicVisible: boolean
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
  status: TaskStatus
}

export type SortedTasks = Record<TaskStatus, TaskDTO[]>
export const emptySortedTasks: SortedTasks = {
  todo: [],
  inProgress: [],
  done: []
}

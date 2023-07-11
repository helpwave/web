import type { TaskStatus } from '@helpwave/proto-ts/proto/services/task_svc/v1/task_svc_pb'

export type SubTaskDTO = {
  id: string,
  name: string,
  isDone: boolean
}

export type TaskDTO = {
  id: string,
  name: string,
  assignee: string,
  notes: string,
  status: TaskStatus,
  subtasks: SubTaskDTO[],
  dueDate: Date,
  creationDate?: Date,
  isPublicVisible: boolean
}

export type TaskMinimalDTO = {
  id: string,
  name: string,
  status: TaskStatus
}

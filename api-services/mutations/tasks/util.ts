import type { SubTaskDTO } from '../../types/tasks/task'

interface GRPCSubTask {
  getId: () => string,
  getName: () => string,
  getDone: () => boolean,
}

export const GRPCMapper = {
  subtaskFromGRPC: (subTask: GRPCSubTask, taskId: string): SubTaskDTO => ({
    id: subTask.getId(),
    name: subTask.getName(),
    isDone: subTask.getDone(),
    taskId
  })
}

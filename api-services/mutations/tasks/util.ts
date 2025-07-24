import type { SubtaskDTO } from '../../types/tasks/task'

interface GRPCSubTask {
  getId: () => string,
  getName: () => string,
  getDone: () => boolean,
}

export const GRPCMapper = {
  subtaskFromGRPC: (subTask: GRPCSubTask, taskId: string): SubtaskDTO => ({
    id: subTask.getId(),
    name: subTask.getName(),
    isDone: subTask.getDone(),
    taskId
  })
}

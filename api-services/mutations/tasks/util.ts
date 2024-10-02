import type { SubTaskDTO } from '../../types/tasks/task'

interface GRPCSubTask {
  getId: () => string,
  getName: () => string,
  getDone: () => boolean
}

export const GRPCMapper = {
  subtaskFromGRPC: (subTask: GRPCSubTask): SubTaskDTO => ({
    id: subTask.getId(),
    name: subTask.getName(),
    isDone: subTask.getDone(),
  })
}

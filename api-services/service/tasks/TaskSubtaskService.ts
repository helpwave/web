import type { SubtaskDTO } from '../../types/tasks/task'
import { APIServices } from '../../services'
import {
  CreateSubtaskRequest,
  DeleteSubtaskRequest,
  UpdateSubtaskRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_svc_pb'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'

export type SubtaskDeleteParameter = {
  id: string,
  taskId: string,
}

export const TaskSubtaskService = {
  create: async function (subtask: SubtaskDTO): Promise<SubtaskDTO> {
    const req = new CreateSubtaskRequest()
      .setSubtask(new CreateSubtaskRequest.Subtask().setName(subtask.name))
      .setTaskId(subtask.taskId)
    const res = await APIServices.task.createSubtask(req, getAuthenticatedGrpcMetadata())

    return {
      ...subtask,
      id: res.getSubtaskId(),
      isDone: false,
    }
  },
  update: async function (subtask: SubtaskDTO): Promise<boolean> {
    const req = new UpdateSubtaskRequest()
    req.setSubtaskId(subtask.id)
      .setTaskId(subtask.taskId)
      .setSubtask(new UpdateSubtaskRequest.Subtask()
        .setName(subtask.name)
        .setDone(subtask.isDone))
    const res = await APIServices.task.updateSubtask(req, getAuthenticatedGrpcMetadata())

    return !!res.toObject()
  },
  delete: async function ({ id, taskId }: SubtaskDeleteParameter): Promise<boolean> {
    const req = new DeleteSubtaskRequest()
      .setSubtaskId(id)
      .setTaskId(taskId)
    const res = await APIServices.task.deleteSubtask(req, getAuthenticatedGrpcMetadata())
    return !!res.toObject()
  },
}

import type { SubTaskDTO } from '../../types/tasks/task'
import { APIServices } from '../../services'
import {
  CreateSubtaskRequest,
  DeleteSubtaskRequest,
  UpdateSubtaskRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_svc_pb'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'

export const TaskSubtaskService = {
  create: async function (subtask: SubTaskDTO): Promise<SubTaskDTO> {
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
  update: async function (subtask: SubTaskDTO): Promise<boolean> {
    const req = new UpdateSubtaskRequest()
    req.setSubtaskId(subtask.id)
      .setTaskId(subtask.taskId)
      .setSubtask(new UpdateSubtaskRequest.Subtask()
        .setName(subtask.name)
        .setDone(subtask.isDone))
    const res = await APIServices.task.updateSubtask(req, getAuthenticatedGrpcMetadata())

    return !!res.toObject()
  },
  delete: async function (subtaskId: string): Promise<boolean> {
    const req = new DeleteSubtaskRequest()
      .setSubtaskId(subtaskId)
    const res = await APIServices.task.deleteSubtask(req, getAuthenticatedGrpcMetadata())
    return !!res.toObject()
  },
}

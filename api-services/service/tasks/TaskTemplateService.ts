import type { TaskTemplateDTO } from '../../types/tasks/tasks_templates'
import {
  CreateTaskTemplateRequest,
  CreateTaskTemplateSubTaskRequest,
  DeleteTaskTemplateRequest,
  DeleteTaskTemplateSubTaskRequest,
  GetAllTaskTemplatesRequest,
  UpdateTaskTemplateRequest,
  UpdateTaskTemplateSubTaskRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/task_template_svc_pb'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import type { SubtaskDTO } from '../../types/tasks/task'

export type TaskTemplateGetOptions = {
  wardId?: string,
  onlyPersonal?: boolean,
  creatorId?: string,
}

export const TaskTemplateService = {
  /* TODO use when we can get the wardId here
  get: async (id: string): Promise<TaskTemplateDTO> => {
    const req = new GetTaskTemplateRequest()
      .setId(id)
    const res = await APIServices.taskTemplates.getTaskTemplate(req, getAuthenticatedGrpcMetadata())
    return {
      id: res.getId(),
      name: res.getName(),
      notes: res.getDescription(),
      subtasks: res.getSubtasksList().map((subtask) => ({
        id: subtask.getId(),
        name: subtask.getName(),
        isDone: false,
        taskId: res.getId(),
      })),
      isPublicVisible: res.getIsPublic(),
      creatorId: res.getCreatedBy(),
    }
  },
  */
  getMany: async (options?: TaskTemplateGetOptions): Promise<TaskTemplateDTO[]> => {
    const req = new GetAllTaskTemplatesRequest()
    if (options?.wardId) {
      req.setWardId(options.wardId)
    }
    if (options?.creatorId) {
      req.setCreatedBy(options.creatorId)
    }
    if (options?.onlyPersonal) {
      req.setPrivateOnly(options.onlyPersonal)
    }
    const res = await APIServices.taskTemplates.getAllTaskTemplates(req, getAuthenticatedGrpcMetadata())
    return res.getTemplatesList().map((template) => ({
      id: template.getId(),
      wardId: options?.wardId,
      name: template.getName(),
      notes: template.getDescription(),
      subtasks: template.getSubtasksList().map((subtask) => ({
        id: subtask.getId(),
        name: subtask.getName(),
        isDone: false,
        taskId: template.getId(),
      })),
      isPublicVisible: template.getIsPublic(),
      creatorId: template.getCreatedBy(),
    }))
  },
  getByWard: async (wardId: string): Promise<TaskTemplateDTO[]> => {
    return TaskTemplateService.getMany({ wardId })
  },
  getByCreator: async (creatorId: string, onlyPersonal: boolean = false): Promise<TaskTemplateDTO[]> => {
    return TaskTemplateService.getMany({ creatorId, onlyPersonal })
  },
  create: async (taskTemplate: TaskTemplateDTO): Promise<TaskTemplateDTO> => {
    const req = new CreateTaskTemplateRequest()
      .setName(taskTemplate.name)
      .setDescription(taskTemplate.notes)
      .setSubtasksList(taskTemplate.subtasks.map((cSubtask) => {
        const subTask = new CreateTaskTemplateRequest.SubTask()
        subTask.setName(cSubtask.name)
        return subTask
      }))
    if (taskTemplate?.wardId) {
      req.setWardId(taskTemplate.wardId)
    }

    const res = await APIServices.taskTemplates.createTaskTemplate(req, getAuthenticatedGrpcMetadata())
    return { ...taskTemplate, id: res.getId() }
  },
  update: async (taskTemplate: TaskTemplateDTO): Promise<boolean> => {
    const updateTaskTemplate = new UpdateTaskTemplateRequest()
      .setId(taskTemplate.id)
      .setName(taskTemplate.name)
      .setDescription(taskTemplate.notes)
    await APIServices.taskTemplates.updateTaskTemplate(updateTaskTemplate, getAuthenticatedGrpcMetadata())
    return true
  },
  delete: async (taskTemplateId: string): Promise<boolean> => {
    const req = new DeleteTaskTemplateRequest()
      .setId(taskTemplateId)
    await APIServices.taskTemplates.deleteTaskTemplate(req, getAuthenticatedGrpcMetadata())
    return true
  }
}

export const TaskTemplateSubtaskService = {
  create: async (subtask: SubtaskDTO): Promise<SubtaskDTO> => {
    const req = new CreateTaskTemplateSubTaskRequest()
      .setName(subtask.name)
      .setTaskTemplateId(subtask.taskId)
    const res = await APIServices.taskTemplates.createTaskTemplateSubTask(req, getAuthenticatedGrpcMetadata())
    return { ...subtask, id: res.getId() }
  },
  update: async (subtask: SubtaskDTO): Promise<boolean> => {
    const req = new UpdateTaskTemplateSubTaskRequest()
      .setName(subtask.name)
      .setSubtaskId(subtask.id)
    await APIServices.taskTemplates.updateTaskTemplateSubTask(req, getAuthenticatedGrpcMetadata())
    return true
  },
  delete: async (subtaskId: string): Promise<boolean> => {
    const req = new DeleteTaskTemplateSubTaskRequest()
      .setId(subtaskId)
    await APIServices.taskTemplates.deleteTaskTemplateSubTask(req, getAuthenticatedGrpcMetadata())
    return true
  }
}

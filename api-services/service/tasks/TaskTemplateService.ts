import type { TaskTemplateDTO } from '../../types/tasks/tasks_templates'
import { GetAllTaskTemplatesRequest } from '@helpwave/proto-ts/services/tasks_svc/v1/task_template_svc_pb'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'

export const TaskTemplateService = {
  getWard: async (wardId: string): Promise<TaskTemplateDTO[]> => {
      const req = new GetAllTaskTemplatesRequest()
        .setWardId(wardId)
      const res = await APIServices.taskTemplates.getAllTaskTemplates(req, getAuthenticatedGrpcMetadata())
      return  res.getTemplatesList().map((template) => ({
        id: template.getId(),
        wardId,
        name: template.getName(),
        notes: template.getDescription(),
        subtasks: template.getSubtasksList().map((subtask) => ({
          id: subtask.getId(),
          name: subtask.getName(),
          isDone: false,
          taskId: template.getId(),
        })),
        isPublicVisible: template.getIsPublic()
      }))
  }
}

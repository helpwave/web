import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import {
  CreateWardRequest,
  DeleteWardRequest,
  GetWardDetailsRequest,
  GetWardOverviewsRequest,
  GetWardRequest,
  UpdateWardRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/ward_svc_pb'
import type { WardDetailDTO, WardMinimalDTO, WardOverviewDTO } from '../../types/tasks/wards'

export const WardService = {
  get: async (id: string): Promise<WardMinimalDTO> => {
    const req = new GetWardRequest()
      .setId(id)
    const res = await APIServices.ward.getWard(req, getAuthenticatedGrpcMetadata())
    return {
      id: res.getId(),
      name: res.getName(),
    }
  },
  getDetails: async (wardId: string): Promise<WardDetailDTO> => {
    const req = new GetWardDetailsRequest()
      .setId(wardId)
    const res = await APIServices.ward.getWardDetails(req, getAuthenticatedGrpcMetadata())

    return {
      id: res.getId(),
      name: res.getName(),
      rooms: res.getRoomsList().map((room) => ({
        id: room.getId(),
        name: room.getName(),
        beds: room.getBedsList().map((bed) => ({
          id: bed.getId()
        }))
      })),
      task_templates: res.getTaskTemplatesList().map((taskTemplate) => ({
        id: taskTemplate.getId(),
        name: taskTemplate.getName(),
        subtasks: taskTemplate.getSubtasksList().map((subTask) => ({
          id: subTask.getId(),
          name: subTask.getName()
        }))
      }))
    }
  },
  getWardOverviews: async (): Promise<WardOverviewDTO[]> => {
    const req = new GetWardOverviewsRequest()
    const res = await APIServices.ward.getWardOverviews(req, getAuthenticatedGrpcMetadata())

    return res.getWardsList().map((ward) => ({
      id: ward.getId(),
      name: ward.getName(),
      bedCount: ward.getBedCount(),
      unscheduled: ward.getTasksTodo(),
      inProgress: ward.getTasksInProgress(),
      done: ward.getTasksDone(),
    }))
  },
  create: async (ward: WardMinimalDTO): Promise<WardMinimalDTO> => {
    const createWardRequest = new CreateWardRequest()
    createWardRequest.setName(ward.name)
    const res = await APIServices.ward.createWard(createWardRequest, getAuthenticatedGrpcMetadata())
    return {
      ...ward,
      id: res.getId()
    }
  },
  update: async (ward: WardMinimalDTO): Promise<boolean> => {
    const req = new UpdateWardRequest()
      .setId(ward.id)
      .setName(ward.name)
    await APIServices.ward.updateWard(req, getAuthenticatedGrpcMetadata())
    return true
  },
  delete: async (id: string): Promise<boolean> => {
    const req = new DeleteWardRequest()
      .setId(id)
    await APIServices.ward.deleteWard(req, getAuthenticatedGrpcMetadata())
    return true
  }
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateWardRequest,
  DeleteWardRequest,
  GetWardDetailsRequest,
  GetWardOverviewsRequest,
  GetWardRequest,
  UpdateWardRequest
} from '@helpwave/proto-ts/services/tasks_svc/v1/ward_svc_pb'
import { noop } from '@helpwave/hightide/util/noop'
import { APIServices } from '../../services'
import { getAuthenticatedGrpcMetadata } from '../../authentication/grpc_metadata'
import type { WardDetailDTO, WardMinimalDTO, WardOverviewDTO } from '../../types/tasks/wards'
import { QueryKeys } from '../query_keys'

export const useWardOverviewsQuery = (organisationId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.wards, organisationId],
    queryFn: async () => {
      const req = new GetWardOverviewsRequest()
      const res = await APIServices.ward.getWardOverviews(req, getAuthenticatedGrpcMetadata(organisationId))

      const wards: WardOverviewDTO[] = res.getWardsList().map((ward) => ({
        id: ward.getId(),
        name: ward.getName(),
        bedCount: ward.getBedCount(),
        unscheduled: ward.getTasksTodo(),
        inProgress: ward.getTasksInProgress(),
        done: ward.getTasksDone(),
      }))

      return wards
    }
  })
}

export const useWardDetailsQuery = (wardId?: string, organizationId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.wards, wardId],
    enabled: !!wardId,
    queryFn: async (): Promise<WardDetailDTO | null> => {
      if (!wardId) {
        return null
      }

      const req = new GetWardDetailsRequest()
      req.setId(wardId)
      const res = await APIServices.ward.getWardDetails(req, getAuthenticatedGrpcMetadata(organizationId))

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
    }
  })
}

export const useWardQuery = (id: string, organisationId?: string) => useQuery({
  queryKey: [QueryKeys.wards, id],
  enabled: !!id,
  queryFn: async (): Promise<WardMinimalDTO> => {
    const req = new GetWardRequest()
    req.setId(id)
    const res = await APIServices.ward.getWard(req, getAuthenticatedGrpcMetadata(organisationId))

    if (!res.toObject()) {
      console.error('error in Ward query')
    }

    return {
      id: res.getId(),
      name: res.getName(),
    }
  }
})

export const useWardUpdateMutation = (organisationId?: string, callback: (ward: WardMinimalDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward: WardMinimalDTO) => {
      const req = new UpdateWardRequest()
      req.setId(ward.id)
      req.setName(ward.name)
      await APIServices.ward.updateWard(req, getAuthenticatedGrpcMetadata(organisationId))

      callback(ward)
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    }
  })
}

export const useWardCreateMutation = (organisationId?: string, callback: (ward: WardMinimalDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward: WardMinimalDTO) => {
      const createWardRequest = new CreateWardRequest()
      createWardRequest.setName(ward.name)
      const res = await APIServices.ward.createWard(createWardRequest, getAuthenticatedGrpcMetadata(organisationId))
      const newWard: WardMinimalDTO = {
        ...ward,
        id: res.getId()
      }

      callback(newWard)
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    }
  })
}

export const useWardDeleteMutation = (organisationId?: string, callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (wardId: string) => {
      const req = new DeleteWardRequest()
      req.setId(wardId)
      await APIServices.ward.deleteWard(req, getAuthenticatedGrpcMetadata(organisationId))

      callback()
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.wards]).catch(console.error)
    }
  })
}

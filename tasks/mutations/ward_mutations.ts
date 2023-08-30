import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateWardRequest,
  DeleteWardRequest,
  GetWardDetailsRequest,
  GetWardOverviewsRequest,
  GetWardRequest,
  UpdateWardRequest
} from '@helpwave/proto-ts/proto/services/task_svc/v1/ward_svc_pb'
import { getAuthenticatedGrpcMetadata, wardService } from '../utils/grpc'
import { noop } from '@helpwave/common/util/noop'

export const wardsQueryKey = 'wards'

export type WardDTO = {
  id: string,
  name: string,
  organizationId?: string
}

export type WardOverviewDTO = {
  id: string,
  name: string,
  bedCount: number,
  unscheduled: number,
  inProgress: number,
  done: number
}

export const emptyWardOverview: WardOverviewDTO = {
  id: '',
  name: '',
  bedCount: 0,
  unscheduled: 0,
  inProgress: 0,
  done: 0
}

export type WardDetailDTO = {
  id: string,
  name: string,
  rooms: {
    id: string,
    name: string,
    beds: {
      id: string
    }[]
  }[],
  task_templates: {
    id: string,
    name: string,
    subtasks: {
      id: string,
      name: string
    }[]
  }[]
}

export const emptyWard: WardDetailDTO = {
  id: '',
  name: '',
  rooms: [],
  task_templates: []
}

export const useWardOverviewsQuery = (organisationId?: string) => {
  return useQuery({
    queryKey: [wardsQueryKey, organisationId],
    queryFn: async () => {
      const req = new GetWardOverviewsRequest()
      const res = await wardService.getWardOverviews(req, getAuthenticatedGrpcMetadata(organisationId))

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

export const useWardDetailsQuery = (wardId?: string, organisationId?: string) => {
  return useQuery({
    queryKey: [wardsQueryKey, wardId],
    enabled: !!wardId,
    queryFn: async () => {
      if (wardId === undefined) return

      const req = new GetWardDetailsRequest()
      req.setId(wardId)
      const res = await wardService.getWardDetails(req, getAuthenticatedGrpcMetadata(organisationId))

      const ward: WardDetailDTO = {
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

      return ward
    }
  })
}

export const useWardQuery = (id: string, organisationId?: string) => {
  return useQuery({
    queryKey: [wardsQueryKey, id],
    enabled: !!id,
    queryFn: async (): Promise<WardDTO> => {
      const req = new GetWardRequest()
      req.setId(id)
      const res = await wardService.getWard(req, getAuthenticatedGrpcMetadata(organisationId))

      return res.toObject()
    }
  })
}

export const useWardUpdateMutation = (organisationId?: string, callback: (ward:WardDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward: WardDTO) => {
      const req = new UpdateWardRequest()
      req.setId(ward.id)
      req.setName(ward.name)
      await wardService.updateWard(req, getAuthenticatedGrpcMetadata(organisationId))

      callback(ward)
    },
    onSuccess: () => {
      queryClient.invalidateQueries([wardsQueryKey]).then()
    }
  })
}

export const useWardCreateMutation = (organisationId?: string, callback: (ward: WardDTO) => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward:WardDTO) => {
      const createWardRequest = new CreateWardRequest()
      createWardRequest.setName(ward.name)
      const res = await wardService.createWard(createWardRequest, getAuthenticatedGrpcMetadata(organisationId))
      const newWard: WardDTO = { ...ward, id: res.getId() }

      callback(newWard)
    },
    onSuccess: () => {
      queryClient.invalidateQueries([wardsQueryKey]).then()
    }
  })
}

export const useWardDeleteMutation = (organisationId?: string, callback: () => void = noop) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (wardId: string) => {
      const req = new DeleteWardRequest()
      req.setId(wardId)
      await wardService.deleteWard(req, getAuthenticatedGrpcMetadata(organisationId))

      callback()
    },
    onSuccess: () => {
      queryClient.invalidateQueries([wardsQueryKey]).then()
    }
  })
}

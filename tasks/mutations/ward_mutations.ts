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

const queryKey = 'wards'

export type WardDTO = {
  id: string,
  name: string
}

export type WardOverviewDTO = {
  id: string,
  name: string,
  bedCount: number,
  unscheduled: number,
  inProgress: number,
  done: number
}

export type WardDetailDTO = {
  id: string,
  name: string,
  rooms: {
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

export const useWardOverviewsQuery = () => {
  return useQuery({
    queryKey: [queryKey, 'overviews'],
    queryFn: async () => {
      const req = new GetWardOverviewsRequest()
      const res = await wardService.getWardOverviews(req, getAuthenticatedGrpcMetadata())

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

export const useWardDetailsQuery = (id?: string) => {
  return useQuery({
    queryKey: [queryKey, 'details', id],
    enabled: id !== undefined,
    queryFn: async () => {
      if (id === undefined) return

      const req = new GetWardDetailsRequest()
      req.setId(id)
      const res = await wardService.getWardDetails(req, getAuthenticatedGrpcMetadata())

      const ward: WardDetailDTO = {
        id: res.getId(),
        name: res.getName(),
        rooms: res.getRoomsList().map((room) => ({
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

export const useWardQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKey, id],
    enabled: id !== undefined,
    queryFn: async (): Promise<WardDTO> => {
      const req = new GetWardRequest()
      req.setId(id)
      const res = await wardService.getWard(req, getAuthenticatedGrpcMetadata())

      return res.toObject()
    }
  })
}

export const useUpdateMutation = (setSelectedWard: (ward:(WardDTO | undefined)) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward: WardDTO) => {
      const req = new UpdateWardRequest()
      req.setId(ward.id)
      req.setName(ward.name)
      await wardService.updateWard(req, getAuthenticatedGrpcMetadata())

      setSelectedWard(ward)
    },
    onMutate: async (ward) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousWards = queryClient.getQueryData<WardDTO[]>([queryKey])

      queryClient.setQueryData<WardDTO[]>(
        [queryKey],
        (old) => [...(old === undefined ? [] : old.filter(value => value.id !== ward.id)), ward])

      return { previousWards }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousWards)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    }
  })
}

export const useCreateMutation = (setSelectedWard: (ward:(WardDTO | undefined)) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward) => {
      const createWardRequest = new CreateWardRequest()
      createWardRequest.setName(ward.name)
      const res = await wardService.createWard(createWardRequest, getAuthenticatedGrpcMetadata())
      const newWard: WardDTO = { ...ward, ...res }

      setSelectedWard(newWard)
    },
    onMutate: async (ward: WardDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousWards = queryClient.getQueryData<WardDTO[]>([queryKey])
      queryClient.setQueryData<WardDTO[]>([queryKey], (old) => [...(old === undefined ? [] : old), ward])
      return { previousWards }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousWards)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}

export const useDeleteMutation = (setSelectedWard: (ward:(WardDTO | undefined)) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ward) => {
      const req = new DeleteWardRequest()
      req.setId(ward.id)
      await wardService.deleteWard(req, getAuthenticatedGrpcMetadata())

      setSelectedWard(undefined)
    },
    onMutate: async (Ward: WardDTO) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] })
      const previousWards = queryClient.getQueryData<WardDTO[]>([queryKey])
      queryClient.setQueryData<WardDTO[]>(
        [queryKey],
        (old) => [...(old === undefined ? [] : old.filter(value => value.id !== Ward.id))])
      return { previousWards }
    },
    onError: (_, newTodo, context) => {
      queryClient.setQueryData([queryKey], context === undefined ? [] : context.previousWards)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }).then()
    },
  })
}
